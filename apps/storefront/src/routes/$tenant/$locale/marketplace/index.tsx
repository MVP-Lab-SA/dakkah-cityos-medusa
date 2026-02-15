// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/marketplace/")({
  component: MarketplacePage,
  head: () => ({
    meta: [
      { title: "Marketplace | Dakkah CityOS" },
      { name: "description", content: "Browse product categories on our marketplace" },
    ],
  }),
})

const categories = [
  { id: "electronics", name: "Electronics", icon: "💻", slug: "electronics", productCount: 1240, color: "bg-ds-info/10" },
  { id: "fashion", name: "Fashion", icon: "👗", slug: "fashion", productCount: 3500, color: "bg-ds-destructive/10" },
  { id: "home", name: "Home & Garden", icon: "🏠", slug: "home-garden", productCount: 890, color: "bg-ds-success/10" },
  { id: "beauty", name: "Beauty", icon: "✨", slug: "beauty", productCount: 2100, color: "bg-ds-primary/10" },
  { id: "sports", name: "Sports", icon: "⚽", slug: "sports", productCount: 760, color: "bg-ds-warning/10" },
  { id: "toys", name: "Toys & Games", icon: "🎮", slug: "toys-games", productCount: 430, color: "bg-ds-warning/10" },
  { id: "automotive", name: "Automotive", icon: "🚗", slug: "automotive", productCount: 320, color: "bg-ds-destructive/10" },
  { id: "books", name: "Books", icon: "📚", slug: "books", productCount: 5600, color: "bg-ds-success/10" },
]

const sortOptions = ["all", "popular", "newest", "trending"] as const
const priceOptions = ["all", "under_50", "50_to_200", "200_to_1000", "over_1000"] as const

function MarketplacePage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [sortFilter, setSortFilter] = useState<string>("popular")
  const [priceFilter, setPriceFilter] = useState<string>("all")

  const filteredCategories = categories.filter((cat) => {
    return searchQuery
      ? cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  })

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-gradient-to-r from-ds-primary to-ds-primary/90 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
            <Link to={`${prefix}` as any} className="hover:text-white transition-colors">{t(locale, 'common.home')}</Link>
            <span>/</span>
            <span className="text-white">Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Marketplace</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Explore our curated selection of products across multiple categories from trusted vendors.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
            <span>{categories.length} categories</span>
            <span>|</span>
            <span>{categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0).toLocaleString()} products</span>
            <span>|</span>
            <span>{t(locale, "marketplace.quality_assured", "Quality assured")}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">{t(locale, 'marketplace.search_label', 'Search')}</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">{t(locale, 'marketplace.sort_label', 'Sort by')}</label>
                <div className="space-y-1">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSortFilter(opt)}
                      className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${sortFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}
                    >
                      {opt === "all" ? t(locale, 'marketplace.all_categories', 'All') : opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">{t(locale, 'marketplace.price_label', 'Price Range')}</label>
                <div className="space-y-1">
                  {priceOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setPriceFilter(opt)}
                      className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${priceFilter === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}
                    >
                      {opt === "all" ? t(locale, 'marketplace.all_prices', 'All Prices') : opt.replace('_', ' ').replace('under', 'Under $').replace('to', '-$').replace('over', 'Over $')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredCategories.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No categories found</h3>
                <p className="text-ds-muted-foreground text-sm">{t(locale, 'marketplace.try_adjusting', 'Try adjusting your filters')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={`${prefix}/categories/${category.slug}` as any}
                    className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/40 transition-all duration-200"
                  >
                    <div className={`${category.color} p-8 flex items-center justify-center min-h-48 relative overflow-hidden`}>
                      <div className="text-7xl group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 group-hover:to-black/10 transition-all" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors mb-2">{category.name}</h3>

                      <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>{category.productCount.toLocaleString()} products</span>
                      </div>

                      <div className="pt-3 border-t border-ds-border">
                        <span className="px-4 py-1.5 text-xs font-semibold text-white bg-ds-primary rounded-lg group-hover:bg-ds-primary/90 transition-colors inline-block">Browse Category</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <section className="py-16 bg-ds-card border-t border-ds-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ds-foreground text-center mb-12">Why Shop Our Marketplace?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-ds-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">🔍</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Wide Selection</h3>
              <p className="text-sm text-ds-muted-foreground">Shop from thousands of products across all major categories.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-ds-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">✅</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Vetted Vendors</h3>
              <p className="text-sm text-ds-muted-foreground">All sellers are verified and quality-checked for your peace of mind.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-ds-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">🛡️</div>
              <h3 className="font-semibold text-ds-foreground mb-2">Secure Shopping</h3>
              <p className="text-sm text-ds-muted-foreground">Protected transactions and hassle-free returns on all purchases.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
