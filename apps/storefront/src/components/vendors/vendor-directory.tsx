import { useState } from "react"
import { VendorCard } from "./vendor-card"
import { VendorFilters } from "./vendor-filters"
import { Button } from "@/components/ui/button"

interface Vendor {
  id: string
  name: string
  handle: string
  logo?: string
  description?: string
  rating?: number
  productCount: number
  location?: string
  badges?: string[]
}

interface VendorDirectoryProps {
  vendors: Vendor[]
  countryCode: string
}

export function VendorDirectory({ vendors, countryCode }: VendorDirectoryProps) {
  const [filteredVendors, setFilteredVendors] = useState(vendors)
  const [page, setPage] = useState(1)
  const itemsPerPage = 12

  const handleFilterChange = (filters: { search?: string; category?: string; rating?: string; sort?: string }) => {
    let result = [...vendors]

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.description?.toLowerCase().includes(query)
      )
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating)
      result = result.filter((v) => (v.rating || 0) >= minRating)
    }

    // Sort
    if (filters.sort) {
      switch (filters.sort) {
        case "rating":
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case "products":
          result.sort((a, b) => b.productCount - a.productCount)
          break
        case "name":
          result.sort((a, b) => a.name.localeCompare(b.name))
          break
      }
    }

    setFilteredVendors(result)
    setPage(1)
  }

  const paginatedVendors = filteredVendors.slice(0, page * itemsPerPage)
  const hasMore = paginatedVendors.length < filteredVendors.length

  return (
    <div>
      <VendorFilters onFilterChange={handleFilterChange} />

      <div className="mt-6">
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
            <p className="text-zinc-500">No vendors found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  name={vendor.name}
                  handle={vendor.handle}
                  logo={vendor.logo}
                  description={vendor.description}
                  rating={vendor.rating}
                  productCount={vendor.productCount}
                  location={vendor.location}
                  countryCode={countryCode}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                  Load More Vendors
                </Button>
              </div>
            )}

            <p className="text-sm text-zinc-500 text-center mt-4">
              Showing {paginatedVendors.length} of {filteredVendors.length} vendors
            </p>
          </>
        )}
      </div>
    </div>
  )
}
