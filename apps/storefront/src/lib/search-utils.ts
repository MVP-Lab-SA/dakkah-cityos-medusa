export interface SearchFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  rating?: number
  inStock?: boolean
  sortBy?: string
  sortOrder?: "asc" | "desc"
  [key: string]: string | number | boolean | undefined
}

export function buildSearchQuery(
  term: string,
  filters?: SearchFilters,
  options?: { page?: number; limit?: number }
): string {
  const params = new URLSearchParams()

  if (term) {
    params.set("q", term.trim())
  }

  if (filters) {
    if (filters.category) params.set("category", filters.category)
    if (filters.minPrice !== undefined) params.set("min_price", String(filters.minPrice))
    if (filters.maxPrice !== undefined) params.set("max_price", String(filters.maxPrice))
    if (filters.brand) params.set("brand", filters.brand)
    if (filters.rating !== undefined) params.set("rating", String(filters.rating))
    if (filters.inStock !== undefined) params.set("in_stock", String(filters.inStock))
    if (filters.sortBy) params.set("sort_by", filters.sortBy)
    if (filters.sortOrder) params.set("sort_order", filters.sortOrder)
  }

  if (options?.page) params.set("page", String(options.page))
  if (options?.limit) params.set("limit", String(options.limit))

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ""
}

export function serializeFilters(filters: SearchFilters): string {
  const entries = Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .sort(([a], [b]) => a.localeCompare(b))

  return entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join("&")
}

export function parseSearchParams(queryString: string): { term: string; filters: SearchFilters; page: number; limit: number } {
  const params = new URLSearchParams(queryString.replace(/^\?/, ""))

  const term = params.get("q") || ""
  const filters: SearchFilters = {}

  if (params.has("category")) filters.category = params.get("category")!
  if (params.has("min_price")) filters.minPrice = Number(params.get("min_price"))
  if (params.has("max_price")) filters.maxPrice = Number(params.get("max_price"))
  if (params.has("brand")) filters.brand = params.get("brand")!
  if (params.has("rating")) filters.rating = Number(params.get("rating"))
  if (params.has("in_stock")) filters.inStock = params.get("in_stock") === "true"
  if (params.has("sort_by")) filters.sortBy = params.get("sort_by")!
  if (params.has("sort_order")) filters.sortOrder = params.get("sort_order") as "asc" | "desc"

  const page = params.has("page") ? Number(params.get("page")) : 1
  const limit = params.has("limit") ? Number(params.get("limit")) : 20

  return { term, filters, page, limit }
}

export function buildFilterHash(filters: SearchFilters): string {
  const serialized = serializeFilters(filters)
  let hash = 0
  for (let i = 0; i < serialized.length; i++) {
    const char = serialized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}
