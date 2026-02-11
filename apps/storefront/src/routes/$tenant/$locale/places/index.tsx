import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { usePOIs } from "@/lib/hooks/use-content"
import { POICardComponent } from "@/components/poi/poi-card"
import { POIFilterBar } from "@/components/poi/poi-filter-bar"
import { POIMapView } from "@/components/poi/poi-map-view"
import { t } from "@/lib/i18n"

export const Route = createFileRoute("/$tenant/$locale/places/")({
  component: PlacesPage,
})

const poiCategories = [
  "Restaurant",
  "Shopping",
  "Healthcare",
  "Education",
  "Entertainment",
  "Government",
  "Transportation",
  "Parks",
]

function PlacesPage() {
  const { tenant, locale } = Route.useParams()
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [ratingFilter, setRatingFilter] = useState<number | undefined>()
  const [sortBy, setSortBy] = useState<string>("")

  const { data: pois, isLoading } = usePOIs({
    category: selectedCategory,
  })

  return (
    <div className="min-h-screen bg-ds-muted">
      <div className="bg-ds-background border-b border-ds-border">
        <div className="content-container py-8">
          <h1 className="text-3xl font-bold text-ds-foreground">
            {t(locale, "poi.places")}
          </h1>
          <p className="text-ds-muted-foreground mt-1">
            {t(locale, "poi.description")}
          </p>
        </div>
      </div>

      <div className="content-container py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <POIFilterBar
            categories={poiCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            ratingFilter={ratingFilter}
            onRatingFilterChange={setRatingFilter}
            locale={locale}
          />

          <div className="flex items-center gap-1 bg-ds-background rounded-lg border border-ds-border p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-ds-primary text-ds-primary-foreground"
                  : "text-ds-muted-foreground hover:text-ds-foreground"
              }`}
              aria-label="Grid view"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-ds-primary text-ds-primary-foreground"
                  : "text-ds-muted-foreground hover:text-ds-foreground"
              }`}
              aria-label="List view"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded transition-colors ${
                viewMode === "map"
                  ? "bg-ds-primary text-ds-primary-foreground"
                  : "text-ds-muted-foreground hover:text-ds-foreground"
              }`}
              aria-label="Map view"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
          </div>
        </div>

        {viewMode === "map" && pois && (
          <div className="mb-6">
            <POIMapView
              pois={pois}
              height="400px"
              locale={locale}
            />
          </div>
        )}

        {isLoading ? (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`bg-ds-background rounded-lg animate-pulse ${
                  viewMode === "grid" ? "h-72" : "h-20"
                }`}
              />
            ))}
          </div>
        ) : !pois?.length ? (
          <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
            <span className="text-4xl block mb-4">📍</span>
            <p className="text-ds-muted-foreground">{t(locale, "common.not_found")}</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pois.map((poi) => (
              <POICardComponent key={poi.id} poi={poi} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {pois.map((poi) => (
              <POICardComponent key={poi.id} poi={poi} variant="compact" locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
