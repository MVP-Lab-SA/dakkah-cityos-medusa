<#
.SYNOPSIS
    Establishes a persistent SSH tunnel to the Replit database.

.DESCRIPTION
    Forwards local port 5433 to the remote 'helium' host on port 5432.
    Uses ServerAliveInterval and auto-restart to keep the tunnel alive.

.PARAMETER ReplitSshCommand
    The full SSH command string from Replit (Tools > SSH).

.EXAMPLE
    .\scripts\connect-replit-db.ps1
    .\scripts\connect-replit-db.ps1 -ReplitSshCommand "ssh -i C:/Users/you/.ssh/id_ed25519 user@host.replit.dev"
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$ReplitSshCommand
)

# Function to parse .env file
function Get-EnvVar {
    param($Path, $Name)
    if (Test-Path $Path) {
        $lines = Get-Content $Path
        foreach ($line in $lines) {
            if ($line -match "^$Name=(.*)$") {
                return $matches[1].Trim()
            }
        }
    }
    return $null
}

# Try to load from local .env if parameter not provided
if (-not $ReplitSshCommand) {
    $EnvPath = "C:\Users\alqah\Dakkah-CityOS\.env"
    Write-Host "Checking for REPLIT_SSH_COMMAND in $EnvPath..." -ForegroundColor Gray
    $EnvCmd = Get-EnvVar -Path $EnvPath -Name "REPLIT_SSH_COMMAND"
    
    if ($EnvCmd) {
        $ReplitSshCommand = $EnvCmd
        Write-Host "Loaded SSH command from .env" -ForegroundColor Green
    }
    else {
        Write-Error "Please provide -ReplitSshCommand or add REPLIT_SSH_COMMAND to your .env file."
        exit 1
    }
}

Write-Host "Setting up persistent SSH tunnel to Replit DB..." -ForegroundColor Cyan
Write-Host "Target: helium:5432" -ForegroundColor Gray
Write-Host "Local:  localhost:5433" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the tunnel." -ForegroundColor Yellow

# Add keepalive options and the tunnel forward to the base SSH command
# -o ServerAliveInterval=30  -> send keepalive every 30s
# -o ServerAliveCountMax=3   -> fail after 3 missed keepalives
# -o ExitOnForwardFailure=yes -> exit if port forwarding fails
# -o StrictHostKeyChecking=no -> avoid prompt on first connect
# -L 5433:helium:5432        -> forward local 5433 to remote helium:5432
# -N                         -> no remote command, just tunnel
$TunnelOptions = "-o ServerAliveInterval=30 -o ServerAliveCountMax=3 -o StrictHostKeyChecking=no -L 5433:helium:5432 -N"
$FullCommand = "$ReplitSshCommand $TunnelOptions"

Write-Host "`nCommand: $FullCommand`n" -ForegroundColor DarkGray

# Auto-restart loop — if the tunnel drops, reconnect
$attempt = 0
while ($true) {
    $attempt++
    if ($attempt -gt 1) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Reconnecting (attempt $attempt)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
    else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Tunnel connecting..." -ForegroundColor Cyan
    }

    Invoke-Expression $FullCommand

    $exitCode = $LASTEXITCODE
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Tunnel exited (code $exitCode). Restarting..." -ForegroundColor Red
}
