import { createFileRoute } from "@tanstack/react-router"
import { useVendors } from "@/lib/hooks/use-vendors"
import { VendorCard } from "@/components/vendors"
import { BuildingStorefront, MagnifyingGlass } from "@medusajs/icons"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute("/$countryCode/vendors/")({
  component: VendorsPage,
})

function VendorsPage() {
  const { data: vendors, isLoading } = useVendors()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVendors = vendors?.filter(
    (vendor) =>
      searchQuery === "" ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="content-container py-12">
          <h1 className="text-3xl font-bold text-zinc-900">Vendor Directory</h1>
          <p className="text-zinc-600 mt-2">
            Discover our curated selection of trusted vendors and their products
          </p>

          {/* Search */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="content-container py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !filteredVendors?.length ? (
          <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
            <BuildingStorefront className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500">
              {searchQuery ? "No vendors match your search" : "No vendors available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
