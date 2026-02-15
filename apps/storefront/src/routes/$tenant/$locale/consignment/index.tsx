// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/consignment/")({
  component: ConsignmentPage,
  loader: async () => {
    const tiers = [
      { id: "1", name: "Standard", commission: "70/30", description: "You keep 70% of the sale price. Ideal for everyday items and accessories.", minValue: "50 SAR", features: ["Basic product listing", "Standard photography", "30-day listing period", "Email support"], color: "emerald" },
      { id: "2", name: "Premium", commission: "75/25", description: "You keep 75% of the sale price. Great for designer and branded items.", minValue: "200 SAR", features: ["Featured listing placement", "Professional photography", "60-day listing period", "Priority support"], color: "teal", popular: true },
      { id: "3", name: "Luxury", commission: "80/20", description: "You keep 80% of the sale price. For high-value luxury and collectible items.", minValue: "1,000 SAR", features: ["Premium showcase placement", "Studio photography", "90-day listing period", "Dedicated account manager"], color: "amber" },
    ]
    const benefits = [
      { title: "Earn from Unused Items", description: "Turn pre-owned items into cash without the hassle of selling directly.", icon: "💰" },
      { title: "Professional Handling", description: "We handle photography, listing, pricing, and customer inquiries.", icon: "📸" },
      { title: "Secure & Insured", description: "All consigned items are fully insured while in our care.", icon: "🛡️" },
      { title: "Wide Audience Reach", description: "Access thousands of active buyers on our marketplace.", icon: "🌍" },
      { title: "Transparent Tracking", description: "Real-time updates on views, inquiries, and sales of your items.", icon: "📊" },
      { title: "Fast Payments", description: "Receive your earnings within 3 business days of a completed sale.", icon: "⚡" },
    ]
    return { tiers, benefits }
  },
})

function ConsignmentPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const data = Route.useLoaderData()
  const tiers = data?.tiers || []
  const benefits = data?.benefits || []

  const filteredBenefits = benefits.filter((b: any) =>
    searchQuery ? b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.description.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  const colorMap: Record<string, string> = { emerald: "from-ds-success to-ds-success", teal: "from-ds-success to-ds-success", amber: "from-ds-warning to-ds-warning" }
  const btnMap: Record<string, string> = { emerald: "bg-ds-success hover:bg-ds-success/90", teal: "bg-ds-success hover:bg-ds-success/90", amber: "bg-ds-warning hover:bg-ds-warning/90" }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-gradient-to-r from-ds-success to-ds-success text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
            <Link to={`${prefix}` as any} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Consignment</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Consign With Us</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Turn your pre-owned treasures into cash. We handle everything — you just earn.</p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
            <span>Up to 80% earnings</span><span>|</span><span>Fully insured</span><span>|</span><span>Fast payouts</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search benefits..." className="w-full max-w-md px-4 py-2.5 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-success" />
        </div>

        <h2 className="text-2xl font-bold text-ds-foreground mb-6">Why Consign With Us</h2>
        {filteredBenefits.length === 0 ? (
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">No results found</h3>
            <p className="text-ds-muted-foreground text-sm">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredBenefits.map((b: any, i: number) => (
              <div key={i} className="bg-ds-background border border-ds-border rounded-xl p-6 hover:shadow-lg hover:border-ds-success/40 transition-all duration-200">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-semibold text-ds-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-ds-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-2xl font-bold text-ds-foreground mb-6">Commission Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier: any) => (
            <div key={tier.id} className={`relative bg-ds-background border ${tier.popular ? "border-ds-success ring-2 ring-ds-success/20" : "border-ds-border"} rounded-xl p-6 hover:shadow-lg transition-all duration-200`}>
              {tier.popular && <span className="absolute -top-3 left-6 px-3 py-1 text-xs font-bold bg-ds-success text-white rounded-full">Most Popular</span>}
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorMap[tier.color]} flex items-center justify-center mb-4`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-ds-foreground mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-ds-success">{tier.commission}</span>
                <span className="text-sm text-ds-muted-foreground">split</span>
              </div>
              <p className="text-sm text-ds-muted-foreground mb-2">Min. value: {tier.minValue}</p>
              <p className="text-sm text-ds-muted-foreground mb-4">{tier.description}</p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-ds-foreground">
                    <svg className="w-4 h-4 text-ds-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-lg font-medium text-white transition-colors ${btnMap[tier.color]}`}>Start Consigning</button>
            </div>
          ))}
        </div>
      </div>

      <section className="py-16 bg-ds-card border-t border-ds-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ds-foreground text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[{ step: "1", title: "Submit Items", desc: "Bring or ship your items to our facility for evaluation." }, { step: "2", title: "We Evaluate", desc: "Our experts assess, authenticate, and price your items." }, { step: "3", title: "We Sell", desc: "Items are photographed and listed on our marketplace." }, { step: "4", title: "You Earn", desc: "Receive your earnings within 3 days of a completed sale." }].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-ds-success text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.step}</div>
                <h3 className="font-semibold text-ds-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-ds-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
