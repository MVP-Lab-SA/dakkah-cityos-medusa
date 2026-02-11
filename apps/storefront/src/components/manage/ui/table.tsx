import { type ReactNode, useState } from "react"
import { clsx } from "clsx"
import { TriangleDownMini, TriangleUpMini, ChevronLeft, ChevronRight } from "@medusajs/icons"

type SortDirection = "asc" | "desc" | null

interface TableColumn<T> {
  key: string
  header: string
  render?: (value: unknown, row: T) => ReactNode
  align?: "start" | "center" | "end"
  sortable?: boolean
  width?: string
}

interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  onSort?: (key: string, direction: SortDirection) => void
  sortKey?: string
  sortDirection?: SortDirection
  pageSize?: number
  page?: number
  totalCount?: number
  onPageChange?: (page: number) => void
  onRowClick?: (row: T, index: number) => void
  rowKey?: string | ((row: T, index: number) => string)
  className?: string
}

const alignClass = (align?: "start" | "center" | "end") => {
  if (align === "center") return "text-center"
  if (align === "end") return "text-end"
  return "text-start"
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  pageSize,
  page = 0,
  totalCount,
  onPageChange,
  onRowClick,
  rowKey,
  className,
}: TableProps<T>) {
  const [localSortKey, setLocalSortKey] = useState<string | null>(null)
  const [localSortDir, setLocalSortDir] = useState<SortDirection>(null)

  const activeSortKey = sortKey ?? localSortKey
  const activeSortDir = sortDirection ?? localSortDir

  const handleSort = (key: string) => {
    let newDir: SortDirection
    if (activeSortKey === key) {
      newDir = activeSortDir === "asc" ? "desc" : activeSortDir === "desc" ? null : "asc"
    } else {
      newDir = "asc"
    }

    if (!onSort) {
      setLocalSortKey(newDir ? key : null)
      setLocalSortDir(newDir)
    } else {
      onSort(key, newDir)
    }
  }

  let sortedData = data
  if (!onSort && localSortKey && localSortDir) {
    sortedData = [...data].sort((a, b) => {
      const aVal = a[localSortKey]
      const bVal = b[localSortKey]
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (aVal < bVal) return localSortDir === "asc" ? -1 : 1
      if (aVal > bVal) return localSortDir === "asc" ? 1 : -1
      return 0
    })
  }

  const count = totalCount ?? data.length
  const showPagination = pageSize && onPageChange && count > pageSize
  const totalPages = pageSize ? Math.ceil(count / pageSize) : 1
  const rangeStart = page * (pageSize || data.length) + 1
  const rangeEnd = Math.min((page + 1) * (pageSize || data.length), count)

  const getRowKey = (row: T, index: number) => {
    if (typeof rowKey === "function") return rowKey(row, index)
    if (typeof rowKey === "string") return String(row[rowKey] ?? index)
    return String(index)
  }

  return (
    <div className={clsx("overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={clsx(
                    "px-4 py-3 text-[11px] font-medium text-gray-500 uppercase tracking-wider",
                    alignClass(col.align),
                    col.sortable && "cursor-pointer select-none hover:text-gray-700"
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && activeSortKey === col.key && activeSortDir && (
                      activeSortDir === "asc"
                        ? <TriangleUpMini className="w-3 h-3" />
                        : <TriangleDownMini className="w-3 h-3" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((row, rowIdx) => (
              <tr
                key={getRowKey(row, rowIdx)}
                onClick={onRowClick ? () => onRowClick(row, rowIdx) : undefined}
                className={clsx(
                  "hover:bg-gray-50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx(
                      "px-4 py-3 text-sm text-gray-700",
                      alignClass(col.align)
                    )}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Showing {rangeStart}-{rangeEnd} of {count}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => onPageChange!(page - 1)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 px-2">
              {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange!(page + 1)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export type { TableColumn, TableProps, SortDirection }
