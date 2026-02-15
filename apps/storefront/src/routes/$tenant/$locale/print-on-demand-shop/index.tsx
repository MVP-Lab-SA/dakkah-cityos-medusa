// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

const fallbackItems = [
  { id: "pod-1", name: "Classic Cotton T-Shirt", product_type: "t-shirt", thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", description: "Premium 100% ring-spun cotton tee. Available in 20+ colors. Perfect for custom prints.", base_price: 1499, customizable: true },
  { id: "pod-2", name: "Ceramic Coffee Mug 11oz", product_type: "mug", thumbnail: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80", description: "Classic white ceramic mug with wraparound print area. Dishwasher & microwave safe.", base_price: 999, customizable: true },
  { id: "pod-3", name: "Premium Art Poster", product_type: "poster", thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80", description: "Museum-quality giclée print on heavyweight matte paper. Multiple sizes available.", base_price: 1999, customizable: true },
  { id: "pod-4", name: "iPhone/Samsung Phone Case", product_type: "phone_case", thumbnail: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80", description: "Slim-fit, impact-resistant phone case with vibrant edge-to-edge printing.", base_price: 1299, customizable: true },
  { id: "pod-5", name: "Canvas Tote Bag", product_type: "bag", thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80", description: "Durable natural canvas tote with reinforced handles. Large print area.", base_price: 1199, customizable: true },
  { id: "pod-6", name: "Pullover Hoodie", product_type: "hoodie", thumbnail: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80", description: "Soft fleece-lined hoodie with kangaroo pocket. Front and back print areas.", base_price: 3499, customizable: true },
]

export const Route = createFileRoute("/$tenant/$locale/print-on-demand-shop/")({
  component: PrintOnDemandPage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/print-on-demand`, {
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

const productTypeOptions = ["all", "t-shirt", "mug", "poster", "phone_case", "bag", "hoodie"] as const

function PrintOnDemandPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const loaderData = Route.useLoaderData()
  const items = loaderData?.items || []

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = searchQuery
      ? (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesType = typeFilter === "all" || item.product_type === typeFilter
    return matchesSearch && matchesType
  })

  const formatPrice = (price: number) => {
    const amount = price >= 100 ? price / 100 : price
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
  }

  const typeLabel = (t: string) => t.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
            <Link to={`${prefix}` as any} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Print on Demand</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎨 Print on Demand</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Create custom products with your designs — printed and shipped on demand, no inventory required.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
            <span>{items.length} products</span>
            <span>|</span>
            <span>Fully customizable</span>
            <span>|</span>
            <span>No minimums</span>
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
                <label className="block text-sm font-medium text-ds-foreground mb-2">Product Type</label>
                <div className="space-y-1">
                  {productTypeOptions.map((opt) => (
                    <button key={opt} onClick={() => setTypeFilter(opt)} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${typeFilter === opt ? "bg-fuchsia-600 text-white" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Products" : typeLabel(opt)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No products found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item: any) => (
                  <div key={item.id} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-fuchsia-300 transition-all duration-200">
                    <div className="aspect-[4/3] bg-gradient-to-br from-fuchsia-50 to-pink-50 relative overflow-hidden">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><svg className="w-16 h-16 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128z" /></svg></div>
                      )}
                      {item.product_type && (
                        <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-fuchsia-600 text-white rounded-md">{typeLabel(item.product_type)}</span>
                      )}
                      {item.customizable && (
                        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-white/90 text-fuchsia-700 rounded-md flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          Customizable
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-ds-foreground group-hover:text-fuchsia-600 transition-colors line-clamp-1">{item.name}</h3>
                      {item.description && (<p className="text-sm text-ds-muted-foreground mt-1 line-clamp-2">{item.description}</p>)}

                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-ds-border">
                        <div>
                          <span className="text-xs text-ds-muted-foreground">From </span>
                          <span className="font-bold text-fuchsia-600 text-lg">{formatPrice(item.base_price)}</span>
                        </div>
                        <span className="px-4 py-1.5 text-xs font-semibold text-white bg-fuchsia-600 rounded-lg group-hover:bg-fuchsia-700 transition-colors">Customize & Order</span>
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
          <h2 className="text-2xl font-bold text-ds-foreground text-center mb-12">Create Your Product</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-fuchsia-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Choose a Product</h3>
              <p className="text-sm text-ds-muted-foreground">Select from t-shirts, mugs, posters, and more.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-fuchsia-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Upload Your Design</h3>
              <p className="text-sm text-ds-muted-foreground">Add your artwork, photos, or text with our design tool.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-fuchsia-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-ds-foreground mb-2">We Print & Ship</h3>
              <p className="text-sm text-ds-muted-foreground">We produce your order and ship directly to you.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
