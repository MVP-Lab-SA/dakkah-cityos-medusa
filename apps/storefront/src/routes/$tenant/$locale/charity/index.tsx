// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/charity/")({
  component: CharityPage,
})

const categories = ["all", "education", "health", "environment", "poverty", "disaster-relief", "animals", "community"] as const
const goalRanges = ["all", "under-1k", "1k-10k", "10k-50k", "over-50k"] as const

function CharityPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [goalRange, setGoalRange] = useState("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const { data, isLoading, error } = useQuery({
    queryKey: ["charity", category, goalRange, page],
    queryFn: () =>
      sdk.client.fetch<{ campaigns: any[]; count: number }>(`/store/charity`, {
        query: {
          ...(category !== "all" && { category }),
          ...(goalRange !== "all" && { goal_range: goalRange }),
          limit,
          offset: (page - 1) * limit,
        },
      }),
  })

  const campaigns = data?.campaigns || []
  const totalPages = Math.ceil((data?.count || 0) / limit)
  const filtered = campaigns.filter((c: any) =>
    searchQuery ? (c.name || c.title || "").toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Charity</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Charity Campaigns</h1>
          <p className="mt-2 text-ds-muted-foreground">Make a difference — support causes that matter to you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search campaigns..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Category</label>
                <div className="space-y-1">
                  {categories.map((opt) => (
                    <button key={opt} onClick={() => { setCategory(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${category === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Categories" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Goal Range</label>
                <div className="space-y-1">
                  {goalRanges.map((opt) => (
                    <button key={opt} onClick={() => { setGoalRange(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${goalRange === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Goals" : opt === "under-1k" ? "Under $1,000" : opt === "1k-10k" ? "$1,000 - $10,000" : opt === "10k-50k" ? "$10,000 - $50,000" : "Over $50,000"}
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
                    <div className="aspect-[4/3] bg-ds-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-ds-muted rounded animate-pulse" />
                      <div className="h-3 w-full bg-ds-muted rounded animate-pulse" />
                      <div className="h-8 w-full bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !filtered || filtered.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No campaigns found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((campaign: any) => {
                    const goal = campaign.goal || 0
                    const raised = campaign.raised || campaign.amount_raised || 0
                    const progress = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0
                    return (
                      <a key={campaign.id} href={`${prefix}/charity/${campaign.id}`} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200">
                        <div className="aspect-[4/3] bg-ds-muted relative overflow-hidden">
                          {(campaign.logo_url || campaign.thumbnail) && <img src={campaign.logo_url || campaign.thumbnail} alt={campaign.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                          {campaign.category && <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full bg-ds-primary/90 text-ds-primary-foreground">{campaign.category}</span>}
                        </div>
                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{campaign.name || campaign.title || "Untitled Campaign"}</h3>
                          {campaign.organization && <p className="text-sm text-ds-muted-foreground">by {campaign.organization}</p>}
                          {campaign.description && <p className="text-xs text-ds-muted-foreground line-clamp-2">{campaign.description}</p>}
                          <div>
                            <div className="w-full bg-ds-muted rounded-full h-2 overflow-hidden">
                              <div className="h-full bg-ds-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-ds-muted-foreground">
                              <span>${(raised / 100).toLocaleString()} raised</span>
                              <span>${(goal / 100).toLocaleString()} goal</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-sm font-medium text-ds-primary group-hover:underline">Donate Now →</span>
                          </div>
                        </div>
                      </a>
                    )
                  })}
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
