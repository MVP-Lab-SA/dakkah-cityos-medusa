import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { usePOIs } from "@/lib/hooks/use-content"
import { POICard } from "@/components/content/poi-card"
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
  const prefix = `/${tenant}/${locale}`
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { data: pois, isLoading } = usePOIs({
    category: selectedCategory,
  })

  return (
    <div className="min-h-screen bg-ds-muted">
      <div className="bg-ds-background border-b border-ds-border">
        <div className="content-container py-8">
          <h1 className="text-3xl font-bold text-ds-foreground">
            {t(locale, "content.poi")}
          </h1>
        </div>
      </div>

      <div className="content-container py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                !selectedCategory
                  ? "bg-ds-primary text-ds-primary-foreground"
                  : "bg-ds-background text-ds-muted-foreground border border-ds-border hover:bg-ds-muted"
              }`}
            >
              {t(locale, "blocks.all_categories")}
            </button>
            {poiCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedCategory === cat
                    ? "bg-ds-primary text-ds-primary-foreground"
                    : "bg-ds-background text-ds-muted-foreground border border-ds-border hover:bg-ds-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

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
          </div>
        </div>

        <div className="bg-ds-background rounded-lg border border-ds-border p-8 mb-6 text-center">
          <span className="text-3xl block mb-2">🗺️</span>
          <p className="text-sm text-ds-muted-foreground">
            {t(locale, "content.view_on_map")}
          </p>
          <p className="text-xs text-ds-muted-foreground mt-1">
            Map integration coming soon
          </p>
        </div>

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
              <POICard key={poi.id} poi={poi} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {pois.map((poi) => (
              <POICard key={poi.id} poi={poi} variant="compact" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
