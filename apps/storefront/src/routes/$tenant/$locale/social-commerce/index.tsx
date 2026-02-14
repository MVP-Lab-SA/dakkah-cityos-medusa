// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/social-commerce/")({
  component: SocialCommercePage,
})

const categories = ["all", "fashion", "electronics", "home", "beauty", "sports", "toys", "handmade"] as const
const priceRanges = ["all", "under-25", "25-50", "50-100", "over-100"] as const
const platforms = ["all", "instagram", "tiktok", "facebook", "youtube", "pinterest"] as const

function SocialCommercePage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [platform, setPlatform] = useState("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const { data, isLoading, error } = useQuery({
    queryKey: ["social-commerce", category, priceRange, platform, page],
    queryFn: () =>
      sdk.client.fetch<{ listings: any[]; count: number }>(`/store/social-commerce`, {
        query: {
          ...(category !== "all" && { category }),
          ...(priceRange !== "all" && { price_range: priceRange }),
          ...(platform !== "all" && { platform }),
          limit,
          offset: (page - 1) * limit,
        },
      }),
  })

  const listings = data?.listings || []
  const totalPages = Math.ceil((data?.count || 0) / limit)
  const filtered = listings.filter((l: any) =>
    searchQuery ? (l.title || l.name || "").toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Social Commerce</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Social Commerce</h1>
          <p className="mt-2 text-ds-muted-foreground">Shop trending products from your favorite social sellers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search listings..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Category</label>
                <div className="space-y-1">
                  {categories.map((opt) => (
                    <button key={opt} onClick={() => { setCategory(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${category === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Price Range</label>
                <div className="space-y-1">
                  {priceRanges.map((opt) => (
                    <button key={opt} onClick={() => { setPriceRange(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${priceRange === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Prices" : opt === "under-25" ? "Under $25" : opt === "25-50" ? "$25 - $50" : opt === "50-100" ? "$50 - $100" : "Over $100"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Platform</label>
                <div className="space-y-1">
                  {platforms.map((opt) => (
                    <button key={opt} onClick={() => { setPlatform(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${platform === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Platforms" : opt.charAt(0).toUpperCase() + opt.slice(1)}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading listings.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                    <div className="aspect-square bg-ds-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                      <div className="h-8 w-full bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !filtered || filtered.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No listings found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((listing: any) => (
                    <a key={listing.id} href={`${prefix}/social-commerce/${listing.id}`} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200">
                      <div className="aspect-square bg-ds-muted relative overflow-hidden">
                        {((listing.images && listing.images[0]) || listing.thumbnail) && <img src={(listing.images && listing.images[0]) || listing.thumbnail} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                        {listing.platform && (
                          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full bg-black/60 text-white capitalize">{listing.platform}</span>
                        )}
                        {listing.likes != null && (
                          <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full bg-black/60 text-white flex items-center gap-1">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                            {listing.likes}
                          </span>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{listing.title || listing.name || "Listing"}</h3>
                        {listing.seller && <p className="text-sm text-ds-muted-foreground">by @{listing.seller}</p>}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-bold text-ds-foreground">{listing.price ? `$${(listing.price / 100).toFixed(2)}` : "Contact"}</span>
                          <span className="text-sm font-medium text-ds-primary group-hover:underline">Shop Now →</span>
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
