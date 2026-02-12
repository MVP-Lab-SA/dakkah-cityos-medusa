import React from 'react'

interface Column<T = any> {
  key: string
  header: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface Pagination {
  page: number
  pageSize: number
  total: number
}

interface DataTableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onRowClick?: (row: T) => void
  selectable?: boolean
  onSelectionChange?: (selected: T[]) => void
  pagination?: Pagination
  onPageChange?: (page: number) => void
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  searchable?: boolean
  onSearch?: (query: string) => void
  actions?: React.ReactNode
  emptyMessage?: string
  exportable?: boolean
  onExport?: () => void
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  onRowClick,
  selectable = false,
  onSelectionChange,
  pagination,
  onPageChange,
  onSort,
  searchable = false,
  onSearch,
  actions,
  emptyMessage = 'No data available',
  exportable = false,
  onExport,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set())
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc')
  const [searchQuery, setSearchQuery] = React.useState('')

  const allSelected = data.length > 0 && selectedRows.size === data.length

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    } else {
      const all = new Set(data.map((_, i) => i))
      setSelectedRows(all)
      onSelectionChange?.(data)
    }
  }

  const handleSelectRow = (index: number) => {
    const next = new Set(selectedRows)
    if (next.has(index)) {
      next.delete(index)
    } else {
      next.add(index)
    }
    setSelectedRows(next)
    onSelectionChange?.(data.filter((_, i) => next.has(i)))
  }

  const handleSort = (key: string) => {
    const dir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortDir(dir)
    onSort?.(key, dir)
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
      {(searchable || exportable || (selectable && selectedRows.size > 0)) && (
        <div className="flex items-center justify-between gap-4 p-4 border-b border-ds-border">
          <div className="flex items-center gap-3 flex-1">
            {searchable && (
              <div className="relative flex-1 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-ds-background border border-ds-border rounded-md text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                />
              </div>
            )}
            {selectable && selectedRows.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-ds-muted-foreground">
                  {selectedRows.size} selected
                </span>
                {actions}
              </div>
            )}
          </div>
          {exportable && (
            <button
              type="button"
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-ds-muted text-ds-foreground rounded-md hover:bg-ds-muted/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ds-border bg-ds-muted/50">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-ds-border"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ds-muted-foreground ${col.sortable ? 'cursor-pointer select-none hover:text-ds-foreground' : ''}`}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex flex-col text-[10px] leading-none">
                        <span className={sortKey === col.key && sortDir === 'asc' ? 'text-ds-foreground' : 'text-ds-muted-foreground/40'}>▲</span>
                        <span className={sortKey === col.key && sortDir === 'desc' ? 'text-ds-foreground' : 'text-ds-muted-foreground/40'}>▼</span>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-ds-border last:border-0">
                  {selectable && (
                    <td className="px-4 py-3">
                      <div className="w-4 h-4 bg-ds-muted rounded animate-pulse" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-ds-muted rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-ds-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm text-ds-muted-foreground">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-ds-border last:border-0 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-ds-muted/50' : ''} ${selectedRows.has(rowIndex) ? 'bg-ds-primary/5' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleSelectRow(rowIndex)}
                        className="w-4 h-4 rounded border-ds-border"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-ds-foreground">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-ds-border">
          <p className="text-sm text-ds-muted-foreground">
            Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className="px-3 py-1.5 text-sm font-medium rounded-md border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (pagination.page <= 3) {
                pageNum = i + 1
              } else if (pagination.page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = pagination.page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange?.(pageNum)}
                  className={`w-8 h-8 text-sm font-medium rounded-md transition-colors ${
                    pageNum === pagination.page
                      ? 'bg-ds-primary text-ds-primary-foreground'
                      : 'text-ds-foreground hover:bg-ds-muted'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              type="button"
              disabled={pagination.page >= totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
              className="px-3 py-1.5 text-sm font-medium rounded-md border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
