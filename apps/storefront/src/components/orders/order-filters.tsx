import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MagnifyingGlass, Funnel, XMark } from "@medusajs/icons"

interface OrderFiltersProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filters: OrderFilterValues) => void
}

interface OrderFilterValues {
  status?: string
  dateRange?: string
  sortBy?: string
}

export function OrderFilters({ onSearch, onFilterChange }: OrderFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<OrderFilterValues>({})

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const handleFilterChange = (key: keyof OrderFilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery("")
    onSearch?.("")
    onFilterChange?.({})
  }

  const hasActiveFilters = searchQuery || Object.values(filters).some(Boolean)

  return (
    <div className="space-y-4">
      {/* Search & Filter Toggle */}
      <div className="flex gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted-foreground" />
          <Input
            placeholder="Search orders by ID or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </form>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-ds-muted" : ""}
        >
          <Funnel className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-ds-background rounded-xl border border-ds-border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">
                Status
              </label>
              <select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full rounded-lg border border-ds-border px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">
                Date Range
              </label>
              <select
                value={filters.dateRange || ""}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                className="w-full rounded-lg border border-ds-border px-3 py-2 text-sm"
              >
                <option value="">All Time</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy || ""}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full rounded-lg border border-ds-border px-3 py-2 text-sm"
              >
                <option value="">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="total-high">Highest Total</option>
                <option value="total-low">Lowest Total</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-ds-border flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <XMark className="w-4 h-4 mr-1" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
