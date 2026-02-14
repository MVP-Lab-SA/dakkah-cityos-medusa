// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/automotive/")({
  component: AutomotivePage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/automotive`, {
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

const makeOptions = ["all", "toyota", "honda", "ford", "chevrolet", "bmw", "mercedes", "audi", "tesla", "nissan", "hyundai"] as const
const priceRangeOptions = ["all", "0-10000", "10000-25000", "25000-50000", "50000-100000", "100000+"] as const
const yearOptions = ["all", "2024", "2023", "2022", "2021", "2020", "2015-2019", "2010-2014", "pre-2010"] as const
const conditionOptions = ["all", "new", "used", "certified"] as const

function AutomotivePage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [makeFilter, setMakeFilter] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [conditionFilter, setConditionFilter] = useState<string>("all")
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
    searchQuery ? `${item.make} ${item.model} ${item.title}`.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Automotive</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Vehicles</h1>
          <p className="mt-2 text-ds-muted-foreground">Find your perfect vehicle from our listings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search vehicles..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Make</label>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {makeOptions.map((opt) => (
                    <button key={opt} onClick={() => { setMakeFilter(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${makeFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Makes" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Price Range</label>
                <div className="space-y-1">
                  {priceRangeOptions.map((opt) => (
                    <button key={opt} onClick={() => { setPriceRange(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${priceRange === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Price" : opt === "100000+" ? "$100K+" : `$${(parseInt(opt.split("-")[0]) / 1000).toFixed(0)}K – $${(parseInt(opt.split("-")[1]) / 1000).toFixed(0)}K`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Year</label>
                <div className="space-y-1">
                  {yearOptions.map((opt) => (
                    <button key={opt} onClick={() => { setYearFilter(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${yearFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Year" : opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Condition</label>
                <div className="space-y-1">
                  {conditionOptions.map((opt) => (
                    <button key={opt} onClick={() => { setConditionFilter(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${conditionFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Condition" : opt === "certified" ? "Certified Pre-Owned" : opt.charAt(0).toUpperCase() + opt.slice(1)}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading vehicles.</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No vehicles found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item: any) => (
                    <a key={item.id} href={`${prefix}/automotive/${item.id}`} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200">
                      <div className="aspect-[4/3] bg-ds-muted relative overflow-hidden">
                        {((item.images && item.images[0]) || item.thumbnail) ? (
                          <img src={(item.images && item.images[0]) || item.thumbnail} alt={`${item.year} ${item.make} ${item.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ds-muted-foreground">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                          </div>
                        )}
                        {item.condition && (
                          <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-md ${item.condition === "new" ? "bg-green-500 text-white" : item.condition === "certified" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}`}>{item.condition === "certified" ? "CPO" : item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">
                          {item.year} {item.make} {item.model}
                        </h3>
                        <p className="text-xl font-bold text-ds-primary mt-1">${(item.price || 0).toLocaleString()}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-ds-muted-foreground">
                          <span>{(item.mileage || 0).toLocaleString()} mi</span>
                          <span>{item.transmission || "Auto"}</span>
                          <span>{item.fuel_type || "Gas"}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ds-border text-sm text-ds-muted-foreground">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span>{item.location || "Location TBD"}</span>
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
