// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/real-estate/")({
  component: RealEstatePage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/real-estate`, {
        headers: {
          "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_56377e90449a39fc4585675802137b09577cd6e17f339eba6dc923eaf22e3445",
        },
      })
      if (!resp.ok) return { items: [], count: 0 }
      const data = await resp.json()
      return { items: data.items || data.listings || data.products || [], count: data.count || 0 }
    } catch {
      return { items: [], count: 0 }
    }
  },
})

const propertyTypeOptions = ["all", "house", "apartment", "condo", "townhouse", "land", "commercial"] as const
const priceRangeOptions = ["all", "0-100000", "100000-300000", "300000-500000", "500000-1000000", "1000000+"] as const
const bedroomOptions = ["all", "1", "2", "3", "4", "5+"] as const

function RealEstatePage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [propertyType, setPropertyType] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [bedrooms, setBedrooms] = useState<string>("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const loaderData = Route.useLoaderData()
  const data = loaderData
  const isLoading = false
  const error = null
  const items = data?.items || []
  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / limit)

  const filteredItems = items.filter((item) =>
    searchQuery ? item.title?.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Real Estate</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Properties</h1>
          <p className="mt-2 text-ds-muted-foreground">Find your perfect home or investment property</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search properties..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Property Type</label>
                <div className="space-y-1">
                  {propertyTypeOptions.map((opt) => (
                    <button key={opt} onClick={() => { setPropertyType(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${propertyType === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Types" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Price Range</label>
                <div className="space-y-1">
                  {priceRangeOptions.map((opt) => (
                    <button key={opt} onClick={() => { setPriceRange(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${priceRange === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Price" : opt === "1000000+" ? "$1M+" : `$${(parseInt(opt.split("-")[0]) / 1000).toFixed(0)}K – $${(parseInt(opt.split("-")[1]) / 1000).toFixed(0)}K`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Bedrooms</label>
                <div className="space-y-1">
                  {bedroomOptions.map((opt) => (
                    <button key={opt} onClick={() => { setBedrooms(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${bedrooms === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Bedrooms" : `${opt} ${opt === "1" ? "Bedroom" : "Bedrooms"}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {error ? (
              <div className="bg-ds-destructive/10 border border-ds-destructive/20 rounded-xl p-8 text-center">
                <svg className="w-12 h-12 text-ds-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-ds-destructive font-medium">Something went wrong loading properties.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                    <div className="aspect-[4/3] bg-ds-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                      <div className="h-6 w-1/2 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No properties found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item: any) => (
                    <a key={item.id} href={`${prefix}/real-estate/${item.id}`} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200">
                      <div className="aspect-[4/3] bg-ds-muted relative overflow-hidden">
                        {((item.images && item.images[0]) || item.thumbnail) ? (
                          <img src={(item.images && item.images[0]) || item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ds-muted-foreground">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                          </div>
                        )}
                        {item.property_type && (
                          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-ds-primary text-ds-primary-foreground rounded-md">{item.property_type.charAt(0).toUpperCase() + item.property_type.slice(1)}</span>
                        )}
                        {item.status && (
                          <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-md ${item.status === "for-sale" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}>{item.status === "for-sale" ? "For Sale" : "For Rent"}</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{item.title}</h3>
                        <p className="text-xl font-bold text-ds-primary mt-1">${(item.price || 0).toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-ds-muted-foreground">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span>{item.location || "Location TBD"}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-ds-border text-sm text-ds-muted-foreground">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                            {item.bedrooms || 0} bd
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            {item.bathrooms || 0} ba
                          </span>
                          <span>{(item.sqft || 0).toLocaleString()} sqft</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                    <span className="text-sm text-ds-muted-foreground">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
