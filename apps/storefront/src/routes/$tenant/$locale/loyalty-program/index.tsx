// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/loyalty-program/")({
  component: LoyaltyProgramPage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/loyalty`, {
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

const categoryOptions = ["all", "retail", "travel", "dining", "entertainment", "finance", "health", "other"] as const

function LoyaltyProgramPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
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
    searchQuery ? item.name?.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Loyalty Programs</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Loyalty Programs</h1>
          <p className="mt-2 text-ds-muted-foreground">Earn rewards and enjoy exclusive benefits</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search programs..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Category</label>
                <div className="space-y-1">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setCategoryFilter(opt); setPage(1) }}
                      className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${categoryFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}
                    >
                      {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading loyalty programs.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden p-5 space-y-3">
                    <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-1/3 bg-ds-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No loyalty programs found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item: any) => (
                    <a
                      key={item.id}
                      href={`${prefix}/loyalty-program/${item.id}`}
                      className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200 p-5"
                    >
                      <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1 mb-2">{item.name || item.title}</h3>
                      {item.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-ds-primary/10 text-ds-primary rounded-md mb-3">{item.category}</span>
                      )}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-ds-muted-foreground">Points per Dollar</span>
                          <span className="font-semibold text-ds-primary">{item.points_per_dollar || item.pointsPerDollar || "1"}</span>
                        </div>
                        {item.tiers && (
                          <div className="flex justify-between">
                            <span className="text-ds-muted-foreground">Tiers</span>
                            <span className="text-ds-foreground">{Array.isArray(item.tiers) ? item.tiers.length : item.tiers}</span>
                          </div>
                        )}
                        {item.benefits && (
                          <div className="flex justify-between">
                            <span className="text-ds-muted-foreground">Benefits</span>
                            <span className="text-ds-foreground">{Array.isArray(item.benefits) ? item.benefits.length : item.benefits}</span>
                          </div>
                        )}
                        {item.partner_count != null && (
                          <div className="flex justify-between">
                            <span className="text-ds-muted-foreground">Partners</span>
                            <span className="text-ds-foreground">{item.partner_count}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-ds-border">
                        <span className="text-xs text-ds-muted-foreground">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recently added"}</span>
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
