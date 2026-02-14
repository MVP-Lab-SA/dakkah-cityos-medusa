export function extractTenantId(url: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    const pathParts = parsed.pathname.split("/").filter(Boolean)
    return pathParts.length > 0 ? pathParts[0] : null
  } catch {
    const parts = url.split("/").filter(Boolean)
    return parts.length > 1 ? parts[1] : parts[0] || null
  }
}

export function buildTenantRoute(tenantId: string, path: string = "/"): string {
  if (!tenantId) return path
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `/${tenantId}${normalizedPath}`
}

export function isValidTenant(tenantId: string): boolean {
  if (!tenantId) return false
  if (tenantId.length < 2 || tenantId.length > 63) return false
  const validPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/
  return validPattern.test(tenantId)
}

export function normalizeTenantId(tenantId: string): string {
  return tenantId
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function extractTenantFromHostname(hostname: string): string | null {
  if (!hostname) return null
  const parts = hostname.split(".")
  if (parts.length >= 3) {
    return parts[0]
  }
  return null
}
