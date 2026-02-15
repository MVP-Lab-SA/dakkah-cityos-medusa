import { type ReactNode, useState, useMemo } from "react"
import { clsx } from "clsx"
import { MagnifyingGlass, TriangleDownMini, TriangleUpMini, ChevronLeft, ChevronRight } from "@medusajs/icons"
import { Skeleton } from "./skeleton"
import { EmptyState } from "./empty-state"

type SortDirection = "asc" | "desc" | null

interface DataTableColumn<T> {
  key: string
  header: string
  render?: (value: unknown, row: T) => ReactNode
  align?: "start" | "center" | "end"
  sortable?: boolean
  filterable?: boolean
  width?: string
}

interface DataTableFilter {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[]
  data: T[]
  searchable?: boolean
  searchPlaceholder?: string
  searchKey?: string
  filters?: DataTableFilter[]
  pageSize?: number
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  countLabel?: string
  isLoading?: boolean
  onRowClick?: (row: T, index: number) => void
  rowKey?: string | ((row: T, index: number) => string)
  headerActions?: ReactNode
  className?: string
}

const alignClass = (align?: "start" | "center" | "end") => {
  if (align === "center") return "text-center"
  if (align === "end") return "text-end"
  return "text-start"
}

function LoadingSkeleton({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-ds-border/50">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = "Search...",
  searchKey,
  filters: filterDefs,
  pageSize = 10,
  emptyTitle = "No results",
  emptyDescription,
  emptyAction,
  countLabel = "results",
  isLoading = false,
  onRowClick,
  rowKey,
  headerActions,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)
  const [page, setPage] = useState(0)
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    let result = data

    if (searchable && searchKey && search) {
      const q = search.toLowerCase()
      result = result.filter((row) => {
        const val = row[searchKey]
        if (typeof val === "string") return val.toLowerCase().includes(q)
        if (typeof val === "number") return String(val).includes(q)
        return true
      })
    }

    for (const [filterKey, filterVal] of Object.entries(activeFilters)) {
      if (filterVal) {
        result = result.filter((row) => String(row[filterKey]) === filterVal)
      }
    }

    return result
  }, [data, search, searchKey, searchable, activeFilters])

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir])

  const totalCount = sorted.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize)
  const rangeStart = totalCount > 0 ? page * pageSize + 1 : 0
  const rangeEnd = Math.min((page + 1) * pageSize, totalCount)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      const next = sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc"
      setSortDir(next)
      if (!next) setSortKey(null)
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
    setPage(0)
  }

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }))
    setPage(0)
  }

  const getRowKey = (row: T, index: number) => {
    if (typeof rowKey === "function") return rowKey(row, index)
    if (typeof rowKey === "string") return String(row[rowKey] ?? index)
    return String(index)
  }

  const hasToolbar = searchable || (filterDefs && filterDefs.length > 0) || headerActions

  return (
    <div className={clsx("space-y-0", className)}>
      {hasToolbar && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <MagnifyingGlass className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-foreground/70" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(0)
                }}
                placeholder={searchPlaceholder}
                className="w-full ps-9 pe-3 py-2 bg-ds-card border border-ds-border rounded-md text-sm text-ds-foreground placeholder:text-ds-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ds-primary focus:shadow-sm"
              />
            </div>
          )}
          {filterDefs && filterDefs.map((f) => (
            <select
              key={f.key}
              value={activeFilters[f.key] || ""}
              onChange={(e) => handleFilterChange(f.key, e.target.value)}
              className="rounded-md border border-ds-border bg-ds-card px-3 py-2 pe-8 text-sm text-ds-foreground/80 focus:outline-none focus:ring-2 focus:ring-ds-primary appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[position:right_0.5rem_center] bg-no-repeat"
            >
              <option value="">{f.label}</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}
          {headerActions && (
            <div className="sm:ms-auto flex items-center gap-2">{headerActions}</div>
          )}
        </div>
      )}

      <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ds-border">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={clsx(
                      "px-4 py-3 text-[11px] font-medium text-ds-muted-foreground uppercase tracking-wider",
                      alignClass(col.align),
                      col.sortable && "cursor-pointer select-none hover:text-ds-foreground"
                    )}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && sortKey === col.key && sortDir && (
                        sortDir === "asc"
                          ? <TriangleUpMini className="w-3 h-3" />
                          : <TriangleDownMini className="w-3 h-3" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ds-border">
              {isLoading ? (
                <LoadingSkeleton cols={columns.length} />
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                      action={emptyAction}
                    />
                  </td>
                </tr>
              ) : (
                paged.map((row, rowIdx) => (
                  <tr
                    key={getRowKey(row, page * pageSize + rowIdx)}
                    onClick={onRowClick ? () => onRowClick(row, page * pageSize + rowIdx) : undefined}
                    className={clsx(
                      "hover:bg-ds-muted/50 transition-colors",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={clsx(
                          "px-4 py-3 text-sm text-ds-foreground/80",
                          alignClass(col.align)
                        )}
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : (row[col.key] as ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-ds-border">
          <p className="text-xs text-ds-muted-foreground">
            {totalCount > 0
              ? `Showing ${rangeStart}-${rangeEnd} of ${totalCount} ${countLabel}`
              : `0 ${countLabel}`}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="inline-flex items-center justify-center w-7 h-7 rounded-md text-ds-muted-foreground hover:bg-ds-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-ds-muted-foreground px-1.5">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="inline-flex items-center justify-center w-7 h-7 rounded-md text-ds-muted-foreground hover:bg-ds-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export type { DataTableColumn, DataTableFilter, DataTableProps }
