// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/crowdfunding/")({
  component: CrowdfundingPage,
})

const categoryOptions = ["all", "technology", "creative", "community", "business", "charity", "education"] as const
const statusOptions = ["all", "active", "funded", "ended"] as const

function CrowdfundingPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const { data, isLoading, error } = useQuery({
    queryKey: ["crowdfunding", categoryFilter, statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      if (statusFilter !== "all") params.set("status", statusFilter)
      params.set("limit", String(limit))
      params.set("offset", String((page - 1) * limit))
      const qs = params.toString()
      const response = await sdk.client.fetch<{ items: any[]; count: number }>(
        `/store/crowdfunding${qs ? `?${qs}` : ""}`,
        { method: "GET", credentials: "include" }
      )
      return response
    },
  })

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
            <span className="text-ds-foreground">Crowdfunding</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Campaigns</h1>
          <p className="mt-2 text-ds-muted-foreground">Support innovative projects and ideas</p>
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
                  placeholder="Search campaigns..."
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

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Status</label>
                <div className="space-y-1">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setStatusFilter(opt); setPage(1) }}
                      className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${statusFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}
                    >
                      {opt === "all" ? "All Statuses" : opt.charAt(0).toUpperCase() + opt.slice(1)}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading campaigns.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                    <div className="aspect-[16/9] bg-ds-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                      <div className="h-3 w-full bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No campaigns found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item: any) => {
                    const progress = item.goal ? Math.min(100, Math.round(((item.raised || 0) / item.goal) * 100)) : 0
                    const daysLeft = item.end_date ? Math.max(0, Math.ceil((new Date(item.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null
                    return (
                      <a
                        key={item.id}
                        href={`${prefix}/crowdfunding/${item.id}`}
                        className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200"
                      >
                        <div className="aspect-[16/9] bg-ds-muted relative overflow-hidden">
                          {((item.images && item.images[0]) || item.thumbnail) ? (
                            <img src={(item.images && item.images[0]) || item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ds-muted-foreground">
                              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                          )}
                          {item.status && (
                            <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-md ${item.status === "active" ? "bg-green-500 text-white" : item.status === "funded" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-2">{item.title}</h3>
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-bold text-ds-primary">${(item.raised || 0).toLocaleString()}</span>
                              <span className="text-ds-muted-foreground">of ${(item.goal || 0).toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-ds-muted rounded-full h-2">
                              <div className="bg-ds-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-ds-border text-sm text-ds-muted-foreground">
                            <span>{progress}% funded</span>
                            <span>{item.backer_count || 0} backers</span>
                            {daysLeft !== null && <span>{daysLeft} days left</span>}
                          </div>
                        </div>
                      </a>
                    )
                  })}
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
