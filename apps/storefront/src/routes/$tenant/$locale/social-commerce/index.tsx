// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/social-commerce/")({
  component: SocialCommercePage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/social-commerce`, {
        headers: {
          "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_56377e90449a39fc4585675802137b09577cd6e17f339eba6dc923eaf22e3445",
        },
      })
      if (!resp.ok) return { listings: [], count: 0 }
      const data = await resp.json()
      return { listings: data.items || data.listings || [], count: data.count || 0 }
    } catch {
      return { listings: [], count: 0 }
    }
  },
})

const categories = ["all", "fashion", "electronics", "home", "beauty", "sports", "toys", "handmade"] as const
const platforms = ["all", "instagram", "tiktok", "facebook", "youtube", "pinterest"] as const

function SocialCommercePage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const loaderData = Route.useLoaderData()
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [platform, setPlatform] = useState("all")

  const allListings = loaderData?.listings || []
  const filtered = allListings.filter((l: any) => {
    if (searchQuery && !(l.name || l.title || "").toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (category !== "all" && l.category?.toLowerCase() !== category) return false
    if (platform !== "all" && l.platform?.toLowerCase() !== platform) return false
    return true
  })

  const formatPrice = (price: number, currency = "SAR") => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    } catch {
      return `${currency} ${price}`
    }
  }

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
                    <button key={opt} onClick={() => setCategory(opt)} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${category === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Platform</label>
                <div className="space-y-1">
                  {platforms.map((opt) => (
                    <button key={opt} onClick={() => setPlatform(opt)} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${platform === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Platforms" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filtered.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No listings found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((listing: any) => (
                  <Link key={listing.id} to={`${prefix}/social-commerce/${listing.handle || listing.id}` as any} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                    <div className="aspect-square bg-gradient-to-br from-pink-50 to-purple-50 relative overflow-hidden">
                      {((listing.images && listing.images[0]) || listing.thumbnail) ? (
                        <img src={(listing.images && listing.images[0]) || listing.thumbnail} alt={listing.name || listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                      )}
                      {listing.platform && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-black/60 text-white capitalize">{listing.platform}</span>
                      )}
                      {listing.likes != null && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full bg-white/90 text-pink-600 shadow-sm flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 fill-pink-500" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                          {listing.likes?.toLocaleString?.() || listing.likes}
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-ds-foreground group-hover:text-blue-600 transition-colors line-clamp-1">{listing.name || listing.title || "Listing"}</h3>
                      {listing.seller && <p className="text-sm text-ds-muted-foreground">by @{listing.seller}</p>}
                      {listing.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium text-gray-700">{listing.rating}</span>
                          {listing.total_reviews && <span className="text-gray-400">({listing.total_reviews.toLocaleString()})</span>}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-ds-border">
                        <span className="text-lg font-bold text-ds-foreground">
                          {listing.price ? formatPrice(listing.price, listing.currency || "SAR") : "Contact"}
                        </span>
                        <span className="text-sm font-medium text-blue-600 group-hover:underline">View Details</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
