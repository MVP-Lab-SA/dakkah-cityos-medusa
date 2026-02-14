export function buildTenantUrl(
  tenant: string | null | undefined,
  locale: string | null | undefined,
  path: string = ""
): string {
  const parts: string[] = []

  if (tenant) parts.push(encodeURIComponent(tenant))
  if (locale) parts.push(encodeURIComponent(locale))

  const base = parts.length > 0 ? `/${parts.join("/")}` : ""
  const cleanPath = path.startsWith("/") ? path : path ? `/${path}` : ""

  return `${base}${cleanPath}` || "/"
}

export function buildProductUrl(
  tenant: string,
  locale: string,
  slug: string
): string {
  return buildTenantUrl(tenant, locale, `/products/${encodeURIComponent(slug)}`)
}

export function buildVendorDashboardUrl(
  tenant: string,
  locale: string,
  section: string = ""
): string {
  const base = buildTenantUrl(tenant, locale, "/vendor")
  return section ? `${base}/${section}` : base
}

export function buildManageUrl(
  tenant: string,
  locale: string,
  section: string = ""
): string {
  const base = buildTenantUrl(tenant, locale, "/manage")
  return section ? `${base}/${section}` : base
}

export function appendQueryParams(
  url: string,
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "") {
      searchParams.set(key, String(value))
    }
  }

  const queryString = searchParams.toString()
  if (!queryString) return url

  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}${queryString}`
}
