import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { PODProductCard, type PODProduct } from "@/components/print-on-demand/pod-product-card"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/print-on-demand/")({
  component: PrintOnDemandPage,
})

function PrintOnDemandPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [products] = useState<PODProduct[]>([])
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
            <span className="text-ds-foreground">{t(locale, "printOnDemand.title")}</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">
            {t(locale, "printOnDemand.browse_products")}
          </h1>
          <p className="mt-2 text-ds-muted-foreground">
            {t(locale, "printOnDemand.subtitle")}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">
              {t(locale, "printOnDemand.no_products")}
            </h3>
            <p className="text-ds-muted-foreground text-sm">
              {t(locale, "printOnDemand.no_products_desc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <PODProductCard
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
