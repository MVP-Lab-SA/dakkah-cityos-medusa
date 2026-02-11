import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { WhiteLabelProductCard, type WhiteLabelProduct } from "@/components/white-label/white-label-product-card"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/white-label/")({
  component: WhiteLabelPage,
})

function WhiteLabelPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [products] = useState<WhiteLabelProduct[]>([])
  const isLoading = false

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">
              {t(locale, "common.home")}
            </Link>
            <span>/</span>
            <span className="text-ds-foreground">{t(locale, "whiteLabel.title")}</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">
            {t(locale, "whiteLabel.browse_products")}
          </h1>
          <p className="mt-2 text-ds-muted-foreground">
            {t(locale, "whiteLabel.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-ds-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                  <div className="h-8 w-full bg-ds-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" />
            </svg>
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">
              {t(locale, "whiteLabel.no_products")}
            </h3>
            <p className="text-ds-muted-foreground text-sm">
              {t(locale, "whiteLabel.no_products_desc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <WhiteLabelProductCard
                key={product.id}
                product={product}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
