import { createFileRoute, Link } from "@tanstack/react-router"
import { usePOI } from "@/lib/hooks/use-content"
import { POIDetail } from "@/components/poi/poi-detail"
import { t } from "@/lib/i18n"

export const Route = createFileRoute("/$tenant/$locale/places/$id")({
  component: PlaceDetailPage,
})

function PlaceDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const { data: poi, isLoading } = usePOI(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ds-muted">
        <div className="content-container py-8 max-w-4xl mx-auto space-y-6">
          <div className="h-80 bg-ds-background rounded-lg animate-pulse" />
          <div className="h-48 bg-ds-background rounded-lg animate-pulse" />
          <div className="h-32 bg-ds-background rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (!poi) {
    return (
      <div className="min-h-screen bg-ds-muted flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4">📍</span>
          <p className="text-ds-muted-foreground mb-4">{t(locale, "common.not_found")}</p>
          <Link
            to={`${prefix}/places` as any}
            className="text-sm text-ds-primary hover:underline"
          >
            {t(locale, "common.back")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ds-muted">
      <div className="bg-ds-background border-b border-ds-border">
        <div className="content-container py-4">
          <nav className="flex items-center gap-2 text-sm text-ds-muted-foreground">
            <Link to={`${prefix}/places` as any} className="hover:text-ds-foreground transition-colors">
              {t(locale, "poi.places")}
            </Link>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-ds-foreground">{poi.name}</span>
          </nav>
        </div>
      </div>

      <div className="content-container py-8">
        <div className="max-w-4xl mx-auto">
          <POIDetail poi={poi} locale={locale} />
        </div>
      </div>
    </div>
  )
}
