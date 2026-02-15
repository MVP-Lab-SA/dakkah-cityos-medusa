// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/print-on-demand/")({
  component: PrintOnDemandPage,
  head: () => ({
    meta: [
      { title: "Print on Demand | Dakkah CityOS" },
      { name: "description", content: "Browse print on demand products on Dakkah CityOS" },
    ],
  }),
  loader: async () => {
    try {
      const products = [
        { id: "1", name: "T-Shirts", description: "Premium cotton tees in 20+ colors. Perfect for custom designs, logos, and artwork.", startingAt: "35 SAR", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop" },
        { id: "2", name: "Hoodies", description: "Comfortable fleece hoodies with full-color front and back printing options.", startingAt: "89 SAR", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop" },
        { id: "3", name: "Mugs", description: "Ceramic mugs with vibrant, dishwasher-safe prints. 11oz and 15oz sizes available.", startingAt: "25 SAR", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop" },
        { id: "4", name: "Phone Cases", description: "Durable phone cases with high-resolution prints for iPhone and Samsung models.", startingAt: "39 SAR", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop" },
        { id: "5", name: "Tote Bags", description: "Eco-friendly canvas tote bags with all-over print or centered designs.", startingAt: "29 SAR", image: "https://images.unsplash.com/photo-1597633425046-08f5110420b5?w=400&h=300&fit=crop" },
        { id: "6", name: "Posters & Art", description: "Museum-quality prints on premium paper. Multiple sizes from A4 to A1.", startingAt: "19 SAR", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop" },
      ]
      const benefits = [
        { title: "Zero Upfront Costs", description: "No inventory, no minimum orders. Products are printed only when ordered.", icon: "💸" },
        { title: "Easy Design Tools", description: "Upload your designs or use our built-in editor with templates and mockups.", icon: "🎨" },
        { title: "Global Shipping", description: "We ship to 30+ countries with tracking on every order.", icon: "🌍" },
        { title: "Quality Guarantee", description: "Premium materials and printing. Unhappy? We reprint or refund.", icon: "✅" },
      ]
      return { products, benefits }
    } catch {
      return { products: [], benefits: [] }
    }
  },
})

function PrintOnDemandPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const data = Route.useLoaderData()
  const products = data?.products || []
  const benefits = data?.benefits || []

  const filtered = products.filter((p: any) =>
    searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-gradient-to-r from-ds-destructive to-fuchsia-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
            <Link to={`${prefix}` as any} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Print on Demand</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Print on Demand</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Create and sell custom products with your designs. No inventory, no risk — just creativity.</p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
            <span>No minimums</span><span>|</span><span>100+ products</span><span>|</span><span>Global shipping</span>
          </div>
          <button className="mt-8 px-8 py-3 bg-ds-card text-ds-destructive font-semibold rounded-lg hover:bg-ds-card/90 transition-colors">Start Creating</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((b: any, i: number) => (
            <div key={i} className="bg-gradient-to-br from-ds-destructive/10 to-fuchsia-500/5 border border-ds-destructive/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-semibold text-ds-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-ds-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full max-w-md px-4 py-2.5 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-destructive" />
        </div>

        <h2 className="text-2xl font-bold text-ds-foreground mb-6">Products You Can Create</h2>
        {filtered.length === 0 ? (
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">No products found</h3>
            <p className="text-ds-muted-foreground text-sm">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filtered.map((p: any) => (
              <div key={p.id} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-destructive/40 transition-all duration-200">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 text-xs font-medium bg-ds-card/90 text-ds-foreground rounded-md">From {p.startingAt}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-ds-foreground mb-2 group-hover:text-ds-destructive transition-colors">{p.name}</h3>
                  <p className="text-sm text-ds-muted-foreground mb-4">{p.description}</p>
                  <button className="w-full py-2.5 text-sm font-medium rounded-lg bg-ds-destructive text-white hover:bg-ds-destructive transition-colors">Design Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <section className="py-16 bg-ds-card border-t border-ds-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ds-foreground text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-ds-destructive text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Upload Your Design</h3>
              <p className="text-sm text-ds-muted-foreground">Create or upload artwork using our design tools and mockup generator.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-ds-destructive text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Choose Products</h3>
              <p className="text-sm text-ds-muted-foreground">Select from 100+ product types to apply your designs to.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-ds-destructive text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Start Selling</h3>
              <p className="text-sm text-ds-muted-foreground">List products on your store. We print and ship when orders come in.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
