// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/try-before-you-buy/")({
  component: TryBeforeYouBuyPage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/products?${qs}`, {
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

const categoryOptions = ["all", "electronics", "fashion", "beauty", "furniture", "fitness", "other"] as const
const trialDurationOptions = ["all", "7", "14", "30", "60"] as const

function TryBeforeYouBuyPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [durationFilter, setDurationFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const loaderData = Route.useLoaderData()
  const data = loaderData
  const isLoading = false
  const error = null
  const items = data?.products || []
  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / limit)

  const filteredItems = items.filter((item) =>
    searchQuery ? item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.name?.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Try Before You Buy</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Try Before You Buy</h1>
          <p className="mt-2 text-ds-muted-foreground">Browse products you can try at home before committing to purchase</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-ds-foreground text-center mb-6">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", label: "Choose a product and start your free trial" },
              { step: "2", label: "Try it at home during the trial period" },
              { step: "3", label: "Keep it and pay, or return it for free" },
            ].map((s) => (
              <div key={s.step} className="bg-ds-background border border-ds-border rounded-xl p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-ds-primary text-ds-primary-foreground flex items-center justify-center mx-auto text-lg font-bold mb-4">{s.step}</div>
                <p className="text-sm text-ds-foreground font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
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
                <label className="block text-sm font-medium text-ds-foreground mb-2">Trial Duration</label>
                <div className="space-y-1">
                  {trialDurationOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setDurationFilter(opt); setPage(1) }}
                      className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${durationFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}
                    >
                      {opt === "all" ? "Any Duration" : `${opt} days`}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading products.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                    <div className="aspect-[4/3] bg-ds-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-1/3 bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No try-before-you-buy products found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item: any) => (
                    <a
                      key={item.id}
                      href={`${prefix}/try-before-you-buy/${item.id}`}
                      className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200"
                    >
                      <div className="aspect-[4/3] bg-ds-muted relative overflow-hidden">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title || item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ds-muted-foreground">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-emerald-500 text-white rounded-md">Try Free</span>
                        {item.metadata?.trial_period && (
                          <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-md">{item.metadata.trial_period} day trial</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{item.title || item.name}</h3>
                        {item.collection?.title && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded">{item.collection.title}</span>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-ds-primary">
                            {item.variants?.[0]?.prices?.[0]?.amount
                              ? `$${(item.variants[0].prices[0].amount / 100).toFixed(2)}`
                              : "Contact for price"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-ds-border text-sm text-ds-muted-foreground">
                          <span>{item.metadata?.trial_period ? `${item.metadata.trial_period}-day trial` : "Trial available"}</span>
                          <span>Free returns</span>
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
