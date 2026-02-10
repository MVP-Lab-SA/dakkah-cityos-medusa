import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { useVendors } from "@/lib/hooks/use-vendors"
import { VendorCard } from "@/components/vendors/vendor-card"
import { useState, useMemo } from "react"

export const Route = createFileRoute("/$tenant/$locale/vendors/")({
  component: VendorsPage,
})

function VendorsPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const { data: vendors, isLoading, error } = useVendors()
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("name")

  const filteredVendors = useMemo(() => {
    if (!vendors) return []
    let result = [...vendors]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (v) => v.name.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q)
      )
    }

    switch (sort) {
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "products":
        result.sort((a, b) => (b.product_count || 0) - (a.product_count || 0))
        break
      case "name":
      default:
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [vendors, search, sort])

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">
              {t(locale, "common.home")}
            </Link>
            <span>/</span>
            <span className="text-ds-foreground">Vendors</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Vendor Marketplace</h1>
          <p className="mt-2 text-ds-muted-foreground">
            Discover trusted sellers and browse their unique products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ps-10 pe-4 py-2 bg-ds-background border border-ds-border rounded-lg text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 bg-ds-background border border-ds-border rounded-lg text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="products">Sort by Products</option>
          </select>
        </div>

        {error ? (
          <div className="bg-ds-destructive/10 border border-ds-destructive/20 rounded-xl p-8 text-center">
            <p className="text-ds-destructive">Failed to load vendors</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-ds-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !filteredVendors.length ? (
          <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
            <svg className="w-12 h-12 text-ds-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-ds-muted-foreground">
              {search ? "No vendors match your search" : "No vendors available yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
            <p className="text-sm text-ds-muted-foreground text-center mt-6">
              Showing {filteredVendors.length} of {vendors?.length || 0} vendors
            </p>
          </>
        )}
      </div>
    </div>
  )
}
