import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MagnifyingGlass, XMark } from "@medusajs/icons"

interface VendorFiltersProps {
  onFilterChange: (filters: {
    search?: string
    category?: string
    rating?: string
    sort?: string
  }) => void
}

export function VendorFilters({ onFilterChange }: VendorFiltersProps) {
  const [search, setSearch] = useState("")
  const [rating, setRating] = useState("")
  const [sort, setSort] = useState("")

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange({ search: value, rating, sort })
  }

  const handleRatingChange = (value: string) => {
    setRating(value)
    onFilterChange({ search, rating: value, sort })
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    onFilterChange({ search, rating, sort: value })
  }

  const clearFilters = () => {
    setSearch("")
    setRating("")
    setSort("")
    onFilterChange({})
  }

  const hasFilters = search || rating || sort

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="ps-10"
          />
        </div>

        {/* Rating Filter */}
        <select
          value={rating}
          onChange={(e) => handleRatingChange(e.target.value)}
          className="rounded-lg border border-ds-border px-3 py-2 text-sm"
        >
          <option value="">All Ratings</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3.5">3.5+ Stars</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-lg border border-ds-border px-3 py-2 text-sm"
        >
          <option value="">Sort By</option>
          <option value="rating">Highest Rated</option>
          <option value="products">Most Products</option>
          <option value="name">Name A-Z</option>
        </select>

        {/* Clear */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <XMark className="w-4 h-4 me-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
