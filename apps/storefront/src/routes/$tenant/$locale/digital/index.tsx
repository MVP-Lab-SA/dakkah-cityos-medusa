import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { useDigitalProducts } from "@/lib/hooks/use-digital-products"
import { DigitalProductCard } from "@/components/digital/digital-product-card"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/digital/")({
  component: DigitalProductsPage,
})

const categories = ["all", "ebook", "audio", "video", "software", "template", "image", "pdf"]

function DigitalProductsPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [category, setCategory] = useState("all")
  const [search, setSearch] = useState("")

  const { data, isLoading, error } = useDigitalProducts({
    category: category === "all" ? undefined : category,
    search: search || undefined,
  })

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">
              {t(locale, "common.home")}
            </Link>
            <span>/</span>
            <span className="text-ds-foreground">Digital Products</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Digital Products</h1>
          <p className="mt-2 text-ds-muted-foreground">
            Browse downloadable content, templates, ebooks, and more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search digital products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ps-10 pe-4 py-2 bg-ds-background border border-ds-border rounded-lg text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                category === cat
                  ? "bg-ds-primary text-ds-primary-foreground"
                  : "bg-ds-background text-ds-muted-foreground border border-ds-border hover:bg-ds-muted"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {error ? (
          <div className="bg-ds-destructive/10 border border-ds-destructive/20 rounded-xl p-8 text-center">
            <p className="text-ds-destructive">Failed to load digital products</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-ds-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !data?.digital_products?.length ? (
          <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
            <svg className="w-12 h-12 text-ds-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-ds-muted-foreground">No digital products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.digital_products.map((product) => (
              <DigitalProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
