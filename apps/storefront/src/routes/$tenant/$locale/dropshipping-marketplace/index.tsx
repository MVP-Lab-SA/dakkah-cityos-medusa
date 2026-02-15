// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

const fallbackItems = [
  { id: "ds-1", name: "Wireless Bluetooth Earbuds", category: "electronics", thumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80", description: "High-quality TWS earbuds with active noise cancellation and 24hr battery.", supplier: "TechSource Pro", wholesale_price: 1200, retail_price: 3999, shipping_time: "5-8 days" },
  { id: "ds-2", name: "Yoga Mat Premium", category: "fitness", thumbnail: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80", description: "Non-slip TPE yoga mat, 6mm thick, eco-friendly material.", supplier: "FitGear Supply", wholesale_price: 800, retail_price: 2499, shipping_time: "3-5 days" },
  { id: "ds-3", name: "LED Ring Light 18\"", category: "electronics", thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&q=80", description: "Professional ring light with tripod stand, 3 color modes, dimmable.", supplier: "TechSource Pro", wholesale_price: 1500, retail_price: 4999, shipping_time: "7-10 days" },
  { id: "ds-4", name: "Minimalist Watch Collection", category: "fashion", thumbnail: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80", description: "Sleek stainless steel watches with Japanese movement. Unisex design.", supplier: "StyleDirect", wholesale_price: 2000, retail_price: 7999, shipping_time: "5-7 days" },
  { id: "ds-5", name: "Bamboo Kitchen Utensil Set", category: "home", thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80", description: "12-piece organic bamboo cooking utensil set with holder.", supplier: "EcoHome Goods", wholesale_price: 600, retail_price: 2199, shipping_time: "4-6 days" },
  { id: "ds-6", name: "Portable Blender", category: "home", thumbnail: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80", description: "USB rechargeable personal blender, 380ml, 6 blades.", supplier: "EcoHome Goods", wholesale_price: 900, retail_price: 2999, shipping_time: "3-5 days" },
]

export const Route = createFileRoute("/$tenant/$locale/dropshipping-marketplace/")({
  component: DropshippingMarketplacePage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/dropshipping`, {
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

const categoryOptions = ["all", "electronics", "fashion", "home", "fitness", "beauty"] as const
const supplierOptions = ["all", "TechSource Pro", "FitGear Supply", "StyleDirect", "EcoHome Goods"] as const

function DropshippingMarketplacePage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [supplierFilter, setSupplierFilter] = useState<string>("all")

  const loaderData = Route.useLoaderData()
  const items = loaderData?.items || []

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = searchQuery
      ? (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesSupplier = supplierFilter === "all" || item.supplier === supplierFilter
    return matchesSearch && matchesCategory && matchesSupplier
  })

  const formatPrice = (price: number) => {
    const amount = price >= 100 ? price / 100 : price
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
  }

  const getMargin = (wholesale: number, retail: number) => {
    if (!wholesale || !retail) return 0
    return Math.round(((retail - wholesale) / retail) * 100)
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
            <Link to={`${prefix}` as any} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Dropshipping Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🚀 Dropshipping Marketplace</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Source trending products from verified suppliers — no inventory needed, ship directly to your customers.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
            <span>{items.length} products</span>
            <span>|</span>
            <span>Verified suppliers</span>
            <span>|</span>
            <span>High margins</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Category</label>
                <div className="space-y-1">
                  {categoryOptions.map((opt) => (
                    <button key={opt} onClick={() => setCategoryFilter(opt)} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${categoryFilter === opt ? "bg-violet-600 text-white" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Supplier</label>
                <div className="space-y-1">
                  {supplierOptions.map((opt) => (
                    <button key={opt} onClick={() => setSupplierFilter(opt)} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${supplierFilter === opt ? "bg-violet-600 text-white" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Suppliers" : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No products found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item: any) => {
                  const margin = getMargin(item.wholesale_price, item.retail_price)
                  return (
                    <div key={item.id} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-violet-300 transition-all duration-200">
                      <div className="aspect-[4/3] bg-gradient-to-br from-violet-50 to-indigo-50 relative overflow-hidden">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><svg className="w-16 h-16 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
                        )}
                        {item.supplier && (
                          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-violet-600 text-white rounded-md">{item.supplier}</span>
                        )}
                        {margin > 0 && (
                          <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-green-500 text-white rounded-md">{margin}% margin</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-ds-foreground group-hover:text-violet-600 transition-colors line-clamp-1">{item.name}</h3>
                        {item.description && (<p className="text-sm text-ds-muted-foreground mt-1 line-clamp-2">{item.description}</p>)}

                        <div className="space-y-2 mt-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-ds-muted-foreground">Wholesale</span>
                            <span className="font-semibold text-violet-600">{formatPrice(item.wholesale_price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ds-muted-foreground">Retail Price</span>
                            <span className="font-medium text-ds-foreground">{formatPrice(item.retail_price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ds-muted-foreground">Profit/Unit</span>
                            <span className="font-bold text-green-600">{formatPrice(item.retail_price - item.wholesale_price)}</span>
                          </div>
                        </div>

                        {item.shipping_time && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-ds-muted-foreground">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1 2 1 2-1 2 1 2-1zm8-2v5a1 1 0 01-1 1H6m14-6V8a1 1 0 00-1-1h-4" /></svg>
                            Shipping: {item.shipping_time}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-ds-border">
                          <span className="text-xs text-ds-muted-foreground capitalize">{item.category}</span>
                          <span className="px-4 py-1.5 text-xs font-semibold text-white bg-violet-600 rounded-lg group-hover:bg-violet-700 transition-colors">Add to Store</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      <section className="py-16 bg-ds-card border-t border-ds-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ds-foreground text-center mb-12">Start Dropshipping</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Find Products</h3>
              <p className="text-sm text-ds-muted-foreground">Browse trending products from verified suppliers.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Add to Your Store</h3>
              <p className="text-sm text-ds-muted-foreground">Import products to your store with one click.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Earn Profit</h3>
              <p className="text-sm text-ds-muted-foreground">We ship directly to your customers. You keep the margin.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
