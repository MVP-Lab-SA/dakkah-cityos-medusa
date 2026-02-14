export interface FilterOptions {
  search?: string
  status?: string
  dateFrom?: string | Date
  dateTo?: string | Date
}

export interface SortOptions {
  field: string
  direction: "asc" | "desc"
}

export interface PaginationOptions {
  page: number
  limit: number
}

export function filterBySearch<T extends Record<string, any>>(
  items: T[],
  search: string,
  fields: string[]
): T[] {
  if (!search || !search.trim()) return items

  const term = search.toLowerCase().trim()
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field]
      return value != null && String(value).toLowerCase().includes(term)
    })
  )
}

export function filterByStatus<T extends Record<string, any>>(
  items: T[],
  status: string | null | undefined,
  field: string = "status"
): T[] {
  if (!status) return items
  return items.filter((item) => item[field] === status)
}

export function filterByDateRange<T extends Record<string, any>>(
  items: T[],
  from: string | Date | null | undefined,
  to: string | Date | null | undefined,
  field: string = "created_at"
): T[] {
  return items.filter((item) => {
    const itemDate = new Date(item[field])
    if (isNaN(itemDate.getTime())) return true

    if (from) {
      const fromDate = typeof from === "string" ? new Date(from) : from
      if (itemDate < fromDate) return false
    }

    if (to) {
      const toDate = typeof to === "string" ? new Date(to) : to
      if (itemDate > toDate) return false
    }

    return true
  })
}

export function applyFilters<T extends Record<string, any>>(
  items: T[],
  filters: FilterOptions,
  searchFields: string[] = ["name", "title"]
): T[] {
  let result = items

  if (filters.search) {
    result = filterBySearch(result, filters.search, searchFields)
  }

  if (filters.status) {
    result = filterByStatus(result, filters.status)
  }

  if (filters.dateFrom || filters.dateTo) {
    result = filterByDateRange(result, filters.dateFrom, filters.dateTo)
  }

  return result
}

export function sortItems<T extends Record<string, any>>(
  items: T[],
  options: SortOptions
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[options.field]
    const bVal = b[options.field]

    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return options.direction === "desc" ? -comparison : comparison
  })
}

export function paginate<T>(
  items: T[],
  options: PaginationOptions
): { data: T[]; total: number; totalPages: number; page: number } {
  const total = items.length
  const totalPages = Math.ceil(total / options.limit)
  const start = (options.page - 1) * options.limit
  const data = items.slice(start, start + options.limit)

  return { data, total, totalPages, page: options.page }
}
