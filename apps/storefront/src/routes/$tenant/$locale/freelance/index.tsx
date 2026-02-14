// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/freelance/")({
  component: FreelancePage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/freelance`, {
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

const categoryOptions = ["all", "web-development", "design", "writing", "marketing", "video", "music", "consulting", "other"] as const
const budgetOptions = ["all", "0-50", "50-100", "100-500", "500-1000", "1000+"] as const
const deliveryOptions = ["all", "1-day", "3-days", "7-days", "14-days", "30-days"] as const

function FreelancePage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [budgetFilter, setBudgetFilter] = useState<string>("all")
  const [deliveryFilter, setDeliveryFilter] = useState<string>("all")
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-ds-muted"}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Freelance Services</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Freelance Services</h1>
          <p className="mt-2 text-ds-muted-foreground">Find talented professionals for your projects</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search services..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Category</label>
                <div className="space-y-1">
                  {categoryOptions.map((opt) => (
                    <button key={opt} onClick={() => { setCategoryFilter(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${categoryFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Categories" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Budget Range</label>
                <div className="space-y-1">
                  {budgetOptions.map((opt) => (
                    <button key={opt} onClick={() => { setBudgetFilter(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${budgetFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Budget" : opt === "1000+" ? "$1,000+" : `$${opt.replace("-", " – $")}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Delivery Time</label>
                <div className="space-y-1">
                  {deliveryOptions.map((opt) => (
                    <button key={opt} onClick={() => { setDeliveryFilter(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${deliveryFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Delivery Time" : opt.replace("-", " ").replace("day", "Day").replace("days", "Days")}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading services.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                    <div className="aspect-[4/3] bg-ds-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No services found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item: any) => (
                    <a key={item.id} href={`${prefix}/freelance/${item.id}`} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200">
                      <div className="aspect-[4/3] bg-ds-muted relative overflow-hidden">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ds-muted-foreground">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        {item.category && (
                          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-ds-primary text-ds-primary-foreground rounded-md">{item.category}</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-ds-muted-foreground mt-1 line-clamp-2">{item.description || "Professional freelance service"}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {renderStars(item.rating || 0)}
                          <span className="text-sm text-ds-muted-foreground ml-1">({item.review_count || 0})</span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-ds-border">
                          <span className="text-lg font-bold text-ds-primary">From ${item.price?.toLocaleString() || "N/A"}</span>
                          <span className="text-xs text-ds-muted-foreground">{item.delivery_time || "Flexible"} delivery</span>
                        </div>
                        <div className="mt-2 text-xs text-ds-muted-foreground">{item.seller?.name || "Freelancer"}</div>
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
