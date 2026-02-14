// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/travel/")({
  component: TravelPage,
})

const destinations = ["all", "europe", "asia", "americas", "africa", "oceania", "middle-east"] as const
const durations = ["all", "1-3", "4-7", "8-14", "15+"] as const
const priceRanges = ["all", "budget", "mid-range", "luxury", "ultra-luxury"] as const

function TravelPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [destination, setDestination] = useState("all")
  const [duration, setDuration] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const { data, isLoading, error } = useQuery({
    queryKey: ["travel", destination, duration, priceRange, page],
    queryFn: () =>
      sdk.client.fetch<{ packages: any[]; count: number }>(`/store/travel`, {
        query: {
          ...(destination !== "all" && { destination }),
          ...(duration !== "all" && { duration }),
          ...(priceRange !== "all" && { price_range: priceRange }),
          limit,
          offset: (page - 1) * limit,
        },
      }),
  })

  const packages = data?.packages || []
  const totalPages = Math.ceil((data?.count || 0) / limit)
  const filtered = packages.filter((p: any) =>
    searchQuery ? (p.destination || p.name || p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Travel</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Travel Packages</h1>
          <p className="mt-2 text-ds-muted-foreground">Discover your next adventure with curated travel experiences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search destinations..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Destination</label>
                <div className="space-y-1">
                  {destinations.map((opt) => (
                    <button key={opt} onClick={() => { setDestination(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${destination === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Destinations" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Duration</label>
                <div className="space-y-1">
                  {durations.map((opt) => (
                    <button key={opt} onClick={() => { setDuration(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${duration === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Duration" : opt === "15+" ? "15+ days" : `${opt} days`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Price Range</label>
                <div className="space-y-1">
                  {priceRanges.map((opt) => (
                    <button key={opt} onClick={() => { setPriceRange(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${priceRange === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Prices" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading travel packages.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                    <div className="aspect-[4/3] bg-ds-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-ds-muted rounded animate-pulse" />
                      <div className="h-8 w-full bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !filtered || filtered.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No travel packages found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((pkg: any) => (
                    <a key={pkg.id} href={`${prefix}/travel/${pkg.id}`} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200">
                      <div className="aspect-[4/3] bg-ds-muted relative overflow-hidden">
                        {((pkg.images && pkg.images[0]) || pkg.thumbnail) && <img src={(pkg.images && pkg.images[0]) || pkg.thumbnail} alt={pkg.destination || pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                        {pkg.duration && <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full bg-black/60 text-white">{pkg.duration} days</span>}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{pkg.destination || pkg.name || pkg.title || "Travel Package"}</h3>
                        <div className="flex items-center gap-2 text-xs text-ds-muted-foreground">
                          {pkg.rating && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              {pkg.rating}
                            </span>
                          )}
                          {pkg.departure_date && <span>Departs: {new Date(pkg.departure_date).toLocaleDateString()}</span>}
                        </div>
                        {pkg.amenities && <div className="flex flex-wrap gap-1">{(Array.isArray(pkg.amenities) ? pkg.amenities.slice(0, 3) : []).map((a: string, i: number) => <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-ds-muted text-ds-muted-foreground">{a}</span>)}</div>}
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <span className="text-lg font-bold text-ds-foreground">{pkg.price ? `$${(pkg.price / 100).toFixed(2)}` : "Contact Us"}</span>
                            {pkg.price && <span className="text-xs text-ds-muted-foreground ml-1">/person</span>}
                          </div>
                          <span className="text-sm font-medium text-ds-primary group-hover:underline">Book Now →</span>
                        </div>
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
