import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { ConsignmentItemCard, type ConsignmentItem } from "@/components/consignment/consignment-item-card"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/consignment/")({
  component: ConsignmentPage,
})

function ConsignmentPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [items] = useState<ConsignmentItem[]>([])
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
            <span className="text-ds-foreground">{t(locale, "consignment.title")}</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">
            {t(locale, "consignment.browse_items")}
          </h1>
          <p className="mt-2 text-ds-muted-foreground">
            {t(locale, "consignment.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-ds-primary/5 border border-ds-primary/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-ds-foreground mb-2">
            {t(locale, "consignment.want_to_consign")}
          </h2>
          <p className="text-sm text-ds-muted-foreground mb-4">
            {t(locale, "consignment.consign_desc")}
          </p>
          <Link
            to={`${prefix}/consignment` as any}
            className="inline-flex px-4 py-2 text-sm font-medium rounded-lg bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary/90 transition-colors"
          >
            {t(locale, "consignment.start_consigning")}
          </Link>
        </div>

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
        ) : items.length === 0 ? (
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">
              {t(locale, "consignment.no_items")}
            </h3>
            <p className="text-ds-muted-foreground text-sm">
              {t(locale, "consignment.no_items_desc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <ConsignmentItemCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
