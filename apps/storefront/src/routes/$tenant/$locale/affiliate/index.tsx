// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/affiliate/")({
  component: AffiliatePage,
  loader: async () => {
    const tiers = [
      { id: "1", name: "Starter", commission: "5%", requirement: "0+ sales/month", earnings: "Up to 2,500 SAR/mo", color: "gray", features: ["Basic dashboard", "Standard links", "Monthly payouts", "Email support"], icon: "🚀" },
      { id: "2", name: "Pro", commission: "10%", requirement: "20+ sales/month", earnings: "Up to 10,000 SAR/mo", color: "blue", features: ["Advanced analytics", "Custom links", "Bi-weekly payouts", "Priority support"], icon: "⭐" },
      { id: "3", name: "Elite", commission: "15%", requirement: "50+ sales/month", earnings: "Up to 30,000 SAR/mo", color: "purple", features: ["Real-time analytics", "API access", "Weekly payouts", "Dedicated manager"], icon: "💎", popular: true },
      { id: "4", name: "Partner", commission: "20%", requirement: "100+ sales/month", earnings: "Unlimited", color: "amber", features: ["White-label tools", "Custom integrations", "Daily payouts", "Strategic partnership"], icon: "👑" },
    ]
    const stats = [
      { label: "Active Affiliates", value: "2,500+" },
      { label: "Total Commissions Paid", value: "4.2M SAR" },
      { label: "Avg. Monthly Earning", value: "1,680 SAR" },
      { label: "Products Available", value: "10,000+" },
    ]
    return { tiers, stats }
  },
})

function AffiliatePage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const data = Route.useLoaderData()
  const tiers = data?.tiers || []
  const stats = data?.stats || []

  const filteredTiers = tiers.filter((t: any) =>
    searchQuery ? t.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  const colorBorder: Record<string, string> = { gray: "border-ds-border", blue: "border-blue-500 ring-2 ring-blue-500/20", purple: "border-purple-500 ring-2 ring-purple-500/20", amber: "border-amber-500" }
  const colorBg: Record<string, string> = { gray: "from-gray-500 to-gray-600", blue: "from-blue-500 to-blue-600", purple: "from-purple-500 to-purple-600", amber: "from-amber-500 to-amber-600" }
  const colorBtn: Record<string, string> = { gray: "bg-ds-muted-foreground hover:bg-ds-foreground/80", blue: "bg-blue-600 hover:bg-blue-700", purple: "bg-purple-600 hover:bg-purple-700", amber: "bg-amber-600 hover:bg-amber-700" }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
            <Link to={`${prefix}` as any} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Affiliate Program</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Affiliate Program</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Earn generous commissions by promoting products you love. Join thousands of successful affiliates.</p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
            <span>Up to 20% commission</span><span>|</span><span>Real-time tracking</span><span>|</span><span>Fast payouts</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s: any, i: number) => (
            <div key={i} className="bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-ds-foreground">{s.value}</p>
              <p className="text-xs text-ds-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tiers..." className="w-full max-w-md px-4 py-2.5 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <h2 className="text-2xl font-bold text-ds-foreground mb-6">Commission Tiers</h2>
        {filteredTiers.length === 0 ? (
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">No tiers found</h3>
            <p className="text-ds-muted-foreground text-sm">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredTiers.map((tier: any) => (
              <div key={tier.id} className={`relative bg-ds-background border ${tier.popular ? colorBorder[tier.color] : "border-ds-border"} rounded-xl p-6 hover:shadow-lg transition-all duration-200`}>
                {tier.popular && <span className="absolute -top-3 left-6 px-3 py-1 text-xs font-bold bg-purple-600 text-white rounded-full">Best Value</span>}
                <div className="text-3xl mb-3">{tier.icon}</div>
                <h3 className="text-xl font-bold text-ds-foreground mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-purple-600">{tier.commission}</span>
                  <span className="text-sm text-ds-muted-foreground">commission</span>
                </div>
                <p className="text-xs text-ds-muted-foreground mb-1">{tier.requirement}</p>
                <p className="text-sm font-medium text-ds-foreground mb-4">{tier.earnings}</p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-ds-foreground">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-lg font-medium text-white transition-colors ${colorBtn[tier.color]}`}>Join Now</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <section className="py-16 bg-ds-card border-t border-ds-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ds-foreground text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[{ step: "1", title: "Sign Up", desc: "Create your free affiliate account in minutes." }, { step: "2", title: "Get Links", desc: "Generate unique referral links for any product." }, { step: "3", title: "Promote", desc: "Share links on your website, social media, or blog." }, { step: "4", title: "Earn", desc: "Receive commissions for every successful sale." }].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.step}</div>
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
