<#
.SYNOPSIS
    Establishes an SSH tunnel to the Replit database.

.DESCRIPTION
    This script helps create a local port forwarding tunnel to a Replit container's database.
    It requires the SSH command provided by the Replit UI (Tools > SSH).
    
    It forwards local port 5433 to the remote 'helium' host on port 5432.

.PARAMETER ReplitSshCommand
    The full SSH command string copied from Replit, e.g., "ssh -i id_rsa user@host.replit.dev"

.EXAMPLE
    .\scripts\connect-replit-db.ps1 -ReplitSshCommand "ssh -i .ssh/replit_key user@host.replit.dev"
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

Write-Host "Setting up SSH tunnel to Replit DB..." -ForegroundColor Cyan
Write-Host "Target: helium:5432" -ForegroundColor Gray
Write-Host "Local:  localhost:5433" -ForegroundColor Gray

# Construct the tunnel command
# -L 5433:helium:5432  -> Forward local 5433 to remote helium:5432
# -N                   -> Do not execute a remote command (just forward ports)
# -v                   -> Verbose (optional, good for debugging connection)

$TunnelArgs = "-L 5433:helium:5432 -N"
$FullCommand = "$ReplitSshCommand $TunnelArgs"

Write-Host "Executing: $FullCommand" -ForegroundColor Yellow

# Execute the command
# We use cmd /c to ensure the SSH command string is parsed correctly by the shell if it contains spaces/quotes
Invoke-Expression $FullCommand
