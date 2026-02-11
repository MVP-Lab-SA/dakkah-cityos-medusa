import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { useSuppliers } from "@/lib/hooks/use-dropshipping"
import { SupplierCard } from "@/components/dropshipping/supplier-card"

export const Route = createFileRoute("/$tenant/$locale/dropshipping/")({
  component: DropshippingPage,
})

function DropshippingPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`

  const { data: suppliers, isLoading, error } = useSuppliers()

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">
              {t(locale, "common.home")}
            </Link>
            <span>/</span>
            <span className="text-ds-foreground">{t(locale, "dropshipping.title")}</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">
            {t(locale, "dropshipping.browse_suppliers")}
          </h1>
          <p className="mt-2 text-ds-muted-foreground">
            {t(locale, "dropshipping.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-ds-destructive/10 border border-ds-destructive/20 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-ds-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-ds-destructive font-medium">
              {t(locale, "dropshipping.error_loading")}
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                <div className="p-5 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-ds-muted rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-10 w-full bg-ds-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : !suppliers || suppliers.length === 0 ? (
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">
              {t(locale, "dropshipping.no_suppliers")}
            </h3>
            <p className="text-ds-muted-foreground text-sm">
              {t(locale, "dropshipping.no_suppliers_desc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {suppliers.map((supplier: any) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
