// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

const fallbackItems = [
  { id: "wl-1", name: "Premium Organic Skincare Line", category: "beauty", thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80", description: "Complete skincare range with cleanser, toner, serum, moisturizer. FDA-approved formulations.", moq: 500, price_per_unit: 450, customization: ["Custom label design", "Brand packaging", "Fragrance selection"] },
  { id: "wl-2", name: "Stainless Steel Water Bottles", category: "lifestyle", thumbnail: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80", description: "Double-wall vacuum insulated, 750ml capacity. BPA-free. Keeps drinks cold 24hrs.", moq: 200, price_per_unit: 800, customization: ["Logo engraving", "Color selection", "Cap style"] },
  { id: "wl-3", name: "Organic Coffee Blend", category: "food", thumbnail: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80", description: "Single-origin Arabica beans, medium roast. Fair trade certified. Roasted to order.", moq: 100, price_per_unit: 1200, customization: ["Custom blend ratio", "Package design", "Roast level"] },
  { id: "wl-4", name: "Fitness Apparel Collection", category: "apparel", thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80", description: "Moisture-wicking workout wear including tops, leggings, and shorts. Sustainable fabrics.", moq: 300, price_per_unit: 1500, customization: ["Brand labels", "Color palette", "Size range"] },
  { id: "wl-5", name: "Natural Protein Bars", category: "food", thumbnail: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600&q=80", description: "Plant-based protein bars with 20g protein. No artificial sweeteners. 6 flavors.", moq: 1000, price_per_unit: 150, customization: ["Wrapper design", "Flavor selection", "Nutritional profile"] },
  { id: "wl-6", name: "Eco-Friendly Cleaning Products", category: "home", thumbnail: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80", description: "All-natural, biodegradable cleaning solutions. EPA safer choice certified.", moq: 250, price_per_unit: 350, customization: ["Label design", "Scent options", "Bottle color"] },
]

export const Route = createFileRoute("/$tenant/$locale/white-label-shop/")({
  component: WhiteLabelShopPage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/white-label`, {
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

const categoryOptions = ["all", "beauty", "food", "lifestyle", "apparel", "home", "supplements"] as const

function WhiteLabelShopPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const loaderData = Route.useLoaderData()
  const items = loaderData?.items || []

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = searchQuery
      ? (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const formatPrice = (price: number) => {
    const amount = price >= 100 ? price / 100 : price
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-gradient-to-r from-gray-600 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
            <Link to={`${prefix}` as any} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">White Label Products</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🏭 White Label Products</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Launch your own brand with high-quality white label products — customized with your logo and packaging.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
            <span>{items.length} products</span>
            <span>|</span>
            <span>Custom branding</span>
            <span>|</span>
            <span>Low MOQ</span>
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
                    <button key={opt} onClick={() => setCategoryFilter(opt)} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${categoryFilter === opt ? "bg-gray-700 text-white" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No white label products found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item: any) => (
                  <div key={item.id} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-400 transition-all duration-200">
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-slate-100 relative overflow-hidden">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-gray-700 text-white rounded-md capitalize">{item.category}</span>
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-white/90 text-gray-700 rounded-md">White Label</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-ds-foreground group-hover:text-gray-600 transition-colors line-clamp-1">{item.name}</h3>
                      {item.description && (<p className="text-sm text-ds-muted-foreground mt-1 line-clamp-2">{item.description}</p>)}

                      <div className="space-y-2 mt-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-ds-muted-foreground">MOQ</span>
                          <span className="font-semibold text-ds-foreground">{item.moq?.toLocaleString()} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ds-muted-foreground">Price/Unit</span>
                          <span className="font-bold text-gray-700">{formatPrice(item.price_per_unit)}</span>
                        </div>
                      </div>

                      {item.customization && (
                        <div className="mt-3">
                          <p className="text-xs text-ds-muted-foreground mb-1.5">Customization options:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.customization.map((opt: string) => (
                              <span key={opt} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">{opt}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-ds-border">
                        <span className="text-xs text-ds-muted-foreground">Custom branding included</span>
                        <span className="px-4 py-1.5 text-xs font-semibold text-white bg-gray-700 rounded-lg group-hover:bg-gray-800 transition-colors">Get Quote</span>
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
          <h2 className="text-2xl font-bold text-ds-foreground text-center mb-12">Build Your Brand</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Choose Products</h3>
              <p className="text-sm text-ds-muted-foreground">Select products that align with your brand vision.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Customize & Brand</h3>
              <p className="text-sm text-ds-muted-foreground">Add your logo, colors, and packaging design.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Launch & Sell</h3>
              <p className="text-sm text-ds-muted-foreground">Start selling your branded products to customers.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
