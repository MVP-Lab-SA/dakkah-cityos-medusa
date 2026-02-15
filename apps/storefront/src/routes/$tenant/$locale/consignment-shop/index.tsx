// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

const fallbackItems = [
  { id: "cs-1", name: "Vintage Leather Messenger Bag", category: "accessories", condition: "excellent", thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", description: "Hand-stitched Italian leather bag with brass hardware. Barely used.", consignor: "Sarah M.", commission: 15, price: 18500 },
  { id: "cs-2", name: "Mid-Century Modern Armchair", category: "furniture", condition: "good", thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", description: "Classic Danish design from the 1960s. Reupholstered in teal fabric.", consignor: "James T.", commission: 20, price: 45000 },
  { id: "cs-3", name: "Diamond Tennis Bracelet", category: "jewelry", condition: "like-new", thumbnail: "https://images.unsplash.com/photo-1515562141589-67f0d952b0d3?w=600&q=80", description: "18k white gold with 3.5 carats total weight. Comes with certificate.", consignor: "Elena R.", commission: 12, price: 250000 },
  { id: "cs-4", name: "Canon EOS R5 Camera Body", category: "electronics", condition: "excellent", thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", description: "Professional mirrorless camera, low shutter count. Includes original box.", consignor: "Michael P.", commission: 18, price: 220000 },
  { id: "cs-5", name: "Original Oil Painting - Sunset", category: "art", condition: "good", thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80", description: "36x48 oil on canvas by local artist. Professionally framed.", consignor: "Gallery One", commission: 25, price: 85000 },
  { id: "cs-6", name: "Designer Silk Evening Gown", category: "clothing", condition: "like-new", thumbnail: "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=600&q=80", description: "Oscar de la Renta silk gown, worn once. Size 6. Dry cleaned.", consignor: "Victoria L.", commission: 20, price: 120000 },
]

export const Route = createFileRoute("/$tenant/$locale/consignment-shop/")({
  component: ConsignmentShopPage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/consignments`, {
        headers: {
          "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_56377e90449a39fc4585675802137b09577cd6e17f339eba6dc923eaf22e3445",
        },
      })
      if (!resp.ok) return { items: fallbackItems, count: fallbackItems.length }
      const data = await resp.json()
      const raw = data.items || data.listings || data.products || []
      return { items: raw.length > 0 ? raw : fallbackItems, count: raw.length > 0 ? (data.count || raw.length) : fallbackItems.length }
    } catch {
      return { items: fallbackItems, count: fallbackItems.length }
    }
  },
})

const categoryOptions = ["all", "clothing", "accessories", "electronics", "furniture", "jewelry", "art"] as const
const conditionOptions = ["all", "like-new", "excellent", "good", "fair"] as const

function ConsignmentShopPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [conditionFilter, setConditionFilter] = useState<string>("all")

  const loaderData = Route.useLoaderData()
  const items = loaderData?.items || []

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = searchQuery
      ? (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesCondition = conditionFilter === "all" || item.condition === conditionFilter
    return matchesSearch && matchesCategory && matchesCondition
  })

  const formatPrice = (price: number) => {
    const amount = price >= 100 ? price / 100 : price
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
  }

  const conditionColor = (c: string) => {
    switch (c) {
      case "like-new": return "bg-emerald-100 text-emerald-800"
      case "excellent": return "bg-blue-100 text-blue-800"
      case "good": return "bg-yellow-100 text-yellow-800"
      case "fair": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
            <Link to={`${prefix}` as any} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Consignment Shop</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🏷️ Consignment Shop</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Quality pre-owned treasures at exceptional prices. Every item authenticated and verified.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
            <span>{items.length} items available</span>
            <span>|</span>
            <span>Authenticated</span>
            <span>|</span>
            <span>Great savings</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search items..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Category</label>
                <div className="space-y-1">
                  {categoryOptions.map((opt) => (
                    <button key={opt} onClick={() => setCategoryFilter(opt)} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${categoryFilter === opt ? "bg-teal-600 text-white" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Condition</label>
                <div className="space-y-1">
                  {conditionOptions.map((opt) => (
                    <button key={opt} onClick={() => setConditionFilter(opt)} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${conditionFilter === opt ? "bg-teal-600 text-white" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Condition" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No consignment items found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item: any) => (
                  <div key={item.id} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-teal-300 transition-all duration-200">
                    <div className="aspect-[4/3] bg-gradient-to-br from-teal-50 to-emerald-50 relative overflow-hidden">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><svg className="w-16 h-16 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                      )}
                      {item.condition && (
                        <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-md capitalize ${conditionColor(item.condition)}`}>{item.condition.replace("-", " ")}</span>
                      )}
                      {item.category && (
                        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-white/90 text-gray-700 rounded-md capitalize">{item.category}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-ds-foreground group-hover:text-teal-600 transition-colors line-clamp-1">{item.name}</h3>
                      {item.description && (<p className="text-sm text-ds-muted-foreground mt-1 line-clamp-2">{item.description}</p>)}
                      {item.consignor && (
                        <p className="text-xs text-ds-muted-foreground mt-2 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Consigned by {item.consignor}
                        </p>
                      )}
                      {item.commission && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-teal-50 text-teal-700 rounded">{item.commission}% commission</span>
                      )}
                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-ds-border">
                        <span className="font-bold text-teal-600 text-lg">{formatPrice(item.price)}</span>
                        <span className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg group-hover:bg-teal-700 transition-colors">Buy Now</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <section className="py-16 bg-ds-card border-t border-ds-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ds-foreground text-center mb-12">How Consignment Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Browse Items</h3>
              <p className="text-sm text-ds-muted-foreground">Discover quality pre-owned items at great prices.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Verified Quality</h3>
              <p className="text-sm text-ds-muted-foreground">Every item is inspected and graded for condition.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Buy with Confidence</h3>
              <p className="text-sm text-ds-muted-foreground">All purchases come with our satisfaction guarantee.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
