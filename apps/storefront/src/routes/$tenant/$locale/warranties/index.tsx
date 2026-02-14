// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/warranties/")({
  component: WarrantiesPage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/warranties`, {
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

const coverageTypes = ["all", "electronics", "appliances", "automotive", "home", "furniture", "jewelry"] as const
const durationOptions = ["all", "1-year", "2-year", "3-year", "5-year", "lifetime"] as const
const priceRanges = ["all", "under-50", "50-100", "100-200", "over-200"] as const

function WarrantiesPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [coverageType, setCoverageType] = useState("all")
  const [duration, setDuration] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const loaderData = Route.useLoaderData()
  const data = loaderData
  const isLoading = false
  const error = null

  const warranties = data?.warranties || []
  const totalPages = Math.ceil((data?.count || 0) / limit)
  const filtered = warranties.filter((w: any) =>
    searchQuery ? (w.name || w.title || "").toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Warranties</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Warranty Plans</h1>
          <p className="mt-2 text-ds-muted-foreground">Protect your purchases with extended warranty coverage</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search warranties..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Coverage Type</label>
                <div className="space-y-1">
                  {coverageTypes.map((opt) => (
                    <button key={opt} onClick={() => { setCoverageType(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${coverageType === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Types" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Duration</label>
                <div className="space-y-1">
                  {durationOptions.map((opt) => (
                    <button key={opt} onClick={() => { setDuration(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${duration === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Duration" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Price Range</label>
                <div className="space-y-1">
                  {priceRanges.map((opt) => (
                    <button key={opt} onClick={() => { setPriceRange(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${priceRange === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Prices" : opt === "under-50" ? "Under $50" : opt === "50-100" ? "$50 - $100" : opt === "100-200" ? "$100 - $200" : "Over $200"}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading warranty plans.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-3">
                    <div className="h-10 w-10 bg-ds-muted rounded-lg animate-pulse" />
                    <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-full bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                    <div className="h-8 w-full bg-ds-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : !filtered || filtered.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No warranty plans found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((warranty: any) => (
                    <a key={warranty.id} href={`${prefix}/warranties/${warranty.id}`} className="group bg-ds-background border border-ds-border rounded-xl p-6 hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-ds-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{warranty.name || "Warranty Plan"}</h3>
                          {warranty.coverage_type && <p className="text-xs text-ds-muted-foreground capitalize">{warranty.coverage_type}</p>}
                        </div>
                      </div>
                      {warranty.duration && <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-ds-muted text-ds-muted-foreground mb-3">{warranty.duration}</span>}
                      {warranty.covered_items && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-ds-foreground mb-1">What's Covered:</p>
                          <ul className="text-xs text-ds-muted-foreground space-y-1">
                            {(Array.isArray(warranty.covered_items) ? warranty.covered_items.slice(0, 3) : [warranty.covered_items]).map((item: string, i: number) => (
                              <li key={i} className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-ds-border">
                        <span className="text-lg font-bold text-ds-foreground">{warranty.price ? `$${(warranty.price / 100).toFixed(2)}` : "Get Quote"}</span>
                        <span className="text-sm font-medium text-ds-primary group-hover:underline">View Plan →</span>
                      </div>
                    </a>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                    <span className="px-4 py-2 text-sm text-ds-muted-foreground">Page {page} of {totalPages}</span>
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
