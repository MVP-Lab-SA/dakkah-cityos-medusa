import { Table, Input } from "@medusajs/ui"
import { MagnifyingGlass, ArrowUpMini, ArrowDownMini } from "@medusajs/icons"
import { useState, useMemo } from "react"

type Column<T> = {
  key: keyof T | string
  header: string
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  filters?: {
    key: string
    label: string
    options: { value: string; label: string }[]
  }[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  loading?: boolean
}

export function DataTable<T extends { id?: string }>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys = [],
  onRowClick,
  emptyMessage = "No data found",
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search
    if (search && searchKeys.length > 0) {
      const lowerSearch = search.toLowerCase()
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key]
          return value && String(value).toLowerCase().includes(lowerSearch)
        })
      )
    }

    // Apply sorting
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortKey]
        const bVal = (b as Record<string, unknown>)[sortKey]
        
        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1
        
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortDir === "asc" ? comparison : -comparison
      })
    }

    return result
  }, [data, search, searchKeys, sortKey, sortDir])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const getValue = (item: T, key: string): unknown => {
    const keys = key.split(".")
    let value: unknown = item
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return value
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ui-fg-base"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <div className="relative max-w-[400px]">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-ui-fg-muted w-4 h-4" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Table */}
      <Table>
        <Table.Header>
          <Table.Row>
            {columns.map((col) => (
              <Table.HeaderCell
                key={String(col.key)}
                style={{ width: col.width }}
                className={col.sortable ? "cursor-pointer select-none" : ""}
                onClick={() => col.sortable && handleSort(String(col.key))}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === String(col.key) && (
                    sortDir === "asc" ? (
                      <ArrowUpMini className="w-3 h-3" />
                    ) : (
                      <ArrowDownMini className="w-3 h-3" />
                    )
                  )}
                </div>
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredData.length === 0 ? (
            <Table.Row>
              <Table.Cell className="text-center py-8 text-ui-fg-muted">
                {emptyMessage}
              </Table.Cell>
            </Table.Row>
          ) : (
            filteredData.map((item, idx) => (
              <Table.Row
                key={item.id || idx}
                className={onRowClick ? "cursor-pointer hover:bg-ui-bg-base-hover" : ""}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => {
                  const cellContent = col.cell
                    ? col.cell(item)
                    : String(getValue(item, String(col.key)) ?? "-")
                  return (
                    <Table.Cell key={String(col.key)}>
                      <>{cellContent}</>
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </div>
  )
}
