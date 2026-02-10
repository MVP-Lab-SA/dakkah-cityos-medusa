import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { useBundles } from "@/lib/hooks/use-campaigns"
import { BundleBuilder } from "@/components/campaigns/bundle-builder"

export const Route = createFileRoute("/$tenant/$locale/bundles/")({
  component: BundlesPage,
})

function BundlesPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const { data, isLoading, error } = useBundles()

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">
              {t(locale, "common.home")}
            </Link>
            <span>/</span>
            <span className="text-ds-foreground">Bundles</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Product Bundles</h1>
          <p className="mt-2 text-ds-muted-foreground">
            Save more when you buy together — curated bundles at special prices
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-ds-destructive/10 border border-ds-destructive/20 rounded-xl p-8 text-center">
            <p className="text-ds-destructive">Failed to load bundles</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-ds-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !data?.bundles?.length ? (
          <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
            <svg className="w-12 h-12 text-ds-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-ds-muted-foreground">No bundles available right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.bundles.map((bundle) => (
              <BundleBuilder key={bundle.id} bundle={bundle} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
