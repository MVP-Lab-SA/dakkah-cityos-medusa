// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { t } from "@/lib/i18n"

const hardcodedCampaigns = [
  {
    id: "camp-1",
    title: "Summer Mega Sale",
    description: "Enjoy up to 50% off on selected summer essentials. From fashion to electronics, find incredible deals across all categories.",
    type: "seasonal",
    discount: "50%",
    discount_label: "Up to 50% Off",
    start_date: "2026-06-01",
    end_date: "2026-06-30",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80",
  },
  {
    id: "camp-2",
    title: "Flash Friday Deals",
    description: "24 hours only! Grab limited-time flash deals on top brands. New deals drop every hour — do not miss out.",
    type: "flash",
    discount: "40%",
    discount_label: "Up to 40% Off",
    start_date: "2026-03-14",
    end_date: "2026-03-14",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
  },
  {
    id: "camp-3",
    title: "End of Season Clearance",
    description: "Last chance to save big on winter inventory. Clearance prices on jackets, boots, accessories, and more while supplies last.",
    type: "clearance",
    discount: "70%",
    discount_label: "Up to 70% Off",
    start_date: "2026-02-15",
    end_date: "2026-03-15",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  },
  {
    id: "camp-4",
    title: "Ramadan Special Offers",
    description: "Celebrate the holy month with exclusive offers on groceries, home decor, fashion, and gifting essentials for the whole family.",
    type: "holiday",
    discount: "35%",
    discount_label: "Up to 35% Off",
    start_date: "2026-02-28",
    end_date: "2026-03-30",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80",
  },
  {
    id: "camp-5",
    title: "Tech Tuesday Flash Sale",
    description: "Every Tuesday, score amazing deals on laptops, phones, tablets, and smart home gadgets from premium brands.",
    type: "flash",
    discount: "30%",
    discount_label: "Up to 30% Off",
    start_date: "2026-03-01",
    end_date: "2026-04-30",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  },
  {
    id: "camp-6",
    title: "Spring Collection Launch",
    description: "Be the first to shop our brand-new spring collection. Fresh styles, vibrant colors, and exclusive early-bird discounts.",
    type: "seasonal",
    discount: "25%",
    discount_label: "25% Launch Discount",
    start_date: "2026-03-20",
    end_date: "2026-04-20",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  },
]

export const Route = createFileRoute("/$tenant/$locale/campaigns/")({
  component: CampaignsPage,
  head: () => ({
    meta: [
      { title: "Campaigns | Dakkah CityOS" },
      { name: "description", content: "Browse campaigns on Dakkah CityOS" },
    ],
  }),
  loader: async () => {
    try {
      return { items: hardcodedCampaigns, count: hardcodedCampaigns.length }
    } catch {
      return { items: [], count: 0 }
    }
  },
})

const typeOptions = ["all", "seasonal", "flash", "clearance", "holiday"] as const

const typeColors: Record<string, string> = {
  seasonal: "bg-ds-success",
  flash: "bg-ds-warning",
  clearance: "bg-ds-destructive",
  holiday: "bg-ds-primary",
}

function CampaignsPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const loaderData = Route.useLoaderData()
  const items = loaderData?.items || []

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = searchQuery
      ? (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-gradient-to-r from-ds-destructive to-ds-warning text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
            <Link to={`${prefix}` as any} className="hover:text-white transition-colors">{t(locale, 'common.home')}</Link>
            <span>/</span>
            <span className="text-white">{t(locale, 'crowdfunding.breadcrumb')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t(locale, 'crowdfunding.hero_title')}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t(locale, 'crowdfunding.hero_subtitle')}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
            <span>{items.length} {t(locale, 'crowdfunding.active_campaigns')}</span>
            <span>|</span>
            <span>{t(locale, 'crowdfunding.badge_limited_time')}</span>
            <span>|</span>
            <span>{t(locale, 'crowdfunding.badge_savings')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">{t(locale, 'crowdfunding.search_label')}</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t(locale, 'crowdfunding.search_placeholder')}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">{t(locale, 'crowdfunding.type_label')}</label>
                <div className="space-y-1">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setTypeFilter(opt)}
                      className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${typeFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}
                    >
                      {opt === "all" ? "All Types" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">{t(locale, 'verticals.no_results')}</h3>
                <p className="text-ds-muted-foreground text-sm">{t(locale, 'crowdfunding.no_results_hint')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-destructive/40 transition-all duration-200"
                  >
                    <div className="aspect-[16/10] bg-gradient-to-br from-ds-destructive/10 to-ds-warning/15 relative overflow-hidden">
                      {item.image ? (
                        <img loading="lazy" src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-ds-destructive/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-3 py-1.5 text-sm font-bold bg-ds-destructive text-white rounded-lg shadow-md">
                        {item.discount_label || item.discount}
                      </span>
                      {item.type && (
                        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white rounded-md capitalize ${typeColors[item.type] || "bg-ds-muted-foreground"}`}>{item.type}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-ds-foreground group-hover:text-ds-destructive transition-colors line-clamp-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-ds-muted-foreground mt-1.5 line-clamp-2">{item.description}</p>
                      )}

                      <div className="flex items-center gap-2 mt-3 text-xs text-ds-muted-foreground">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>
                          {new Date(item.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(item.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>

                      <div className="pt-3 mt-3 border-t border-ds-border flex justify-between items-center">
                        <span className="text-lg font-bold text-ds-destructive">{item.discount} OFF</span>
                        <button className="px-4 py-1.5 text-xs font-semibold text-white bg-ds-destructive rounded-lg hover:bg-ds-destructive transition-colors">{t(locale, 'crowdfunding.shop_now')}</button>
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
          <h2 className="text-2xl font-bold text-ds-foreground text-center mb-12">{t(locale, 'crowdfunding.how_it_works_title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-ds-destructive text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">🔔</div>
              <h3 className="font-semibold text-ds-foreground mb-2">{t(locale, 'crowdfunding.step1_title')}</h3>
              <p className="text-sm text-ds-muted-foreground">{t(locale, 'crowdfunding.step1_desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-ds-destructive text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">⏰</div>
              <h3 className="font-semibold text-ds-foreground mb-2">{t(locale, 'crowdfunding.step2_title')}</h3>
              <p className="text-sm text-ds-muted-foreground">{t(locale, 'crowdfunding.step2_desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-ds-destructive text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">🎯</div>
              <h3 className="font-semibold text-ds-foreground mb-2">{t(locale, 'crowdfunding.step3_title')}</h3>
              <p className="text-sm text-ds-muted-foreground">{t(locale, 'crowdfunding.step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
