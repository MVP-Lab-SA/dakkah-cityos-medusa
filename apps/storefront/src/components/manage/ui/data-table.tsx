import { type ReactNode, useState } from "react"
import { MagnifyingGlass } from "@medusajs/icons"

interface Column<T> {
  key: string
  header: string
  render?: (value: unknown, row: T) => ReactNode
  align?: "start" | "center" | "end"
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  searchable?: boolean
  searchPlaceholder?: string
  searchKey?: string
  emptyTitle?: string
  emptyDescription?: string
  countLabel?: string
  className?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = "Search...",
  searchKey,
  emptyTitle = "No results",
  emptyDescription,
  countLabel = "results",
  className = "",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")

  const filtered = searchable && searchKey
    ? data.filter((row) => {
        const val = row[searchKey]
        if (typeof val === "string") {
          return val.toLowerCase().includes(search.toLowerCase())
        }
        return true
      })
    : data

  const alignClass = (align?: "start" | "center" | "end") => {
    if (align === "center") return "text-center"
    if (align === "end") return "text-end"
    return "text-start"
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {searchable && (
        <div className="relative">
          <MagnifyingGlass className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full ps-9 pe-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${alignClass(col.align)}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm font-medium text-gray-500">{emptyTitle}</p>
                      {emptyDescription && (
                        <p className="mt-1 text-xs text-gray-400 max-w-xs">{emptyDescription}</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-sm text-gray-700 ${alignClass(col.align)}`}
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
        <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-200 text-xs text-gray-500">
          {filtered.length} {countLabel}
        </div>
      </div>
    </div>
  )
}
