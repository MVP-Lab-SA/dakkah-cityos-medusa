import { t } from "@/lib/i18n"
import { useState } from "react"

interface EventFilters {
  category?: string
  dateFrom?: string
  dateTo?: string
  minPrice?: number
  maxPrice?: number
  freeOnly?: boolean
}

interface EventFilterProps {
  locale: string
  filters: EventFilters
  onFilterChange: (filters: EventFilters) => void
}

const CATEGORIES = ["music", "sports", "arts", "technology", "food", "community", "business"] as const

export function EventFilter({ locale, filters, onFilterChange }: EventFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof EventFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value ?? undefined })
  }

  const clearFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== false)

  return (
    <div className="bg-ds-background border border-ds-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ds-foreground text-sm">
          {t(locale, "common.search")}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-ds-muted-foreground hover:text-ds-foreground transition-colors md:hidden"
          aria-label={isExpanded ? t(locale, "common.close") : "Expand filters"}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className={`mt-4 space-y-4 ${isExpanded ? "block" : "hidden md:block"}`}>
        <div>
          <label className="block text-xs font-medium text-ds-muted-foreground mb-2">
            {t(locale, "events.category")}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter("category", undefined)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                !filters.category
                  ? "bg-ds-primary text-ds-primary-foreground"
                  : "bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  updateFilter("category", filters.category === cat ? undefined : cat)
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors capitalize ${
                  filters.category === cat
                    ? "bg-ds-primary text-ds-primary-foreground"
                    : "bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ds-muted-foreground mb-2">
            {t(locale, "events.date_time")}
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateFrom ?? ""}
              onChange={(e) => updateFilter("dateFrom", e.target.value || undefined)}
              className="w-full px-3 py-2 text-sm bg-ds-background border border-ds-border rounded-lg text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
            />
            <input
              type="date"
              value={filters.dateTo ?? ""}
              onChange={(e) => updateFilter("dateTo", e.target.value || undefined)}
              className="w-full px-3 py-2 text-sm bg-ds-background border border-ds-border rounded-lg text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ds-muted-foreground mb-2">
            {t(locale, "product.price")}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 text-sm bg-ds-background border border-ds-border rounded-lg text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
            />
            <span className="text-ds-muted-foreground text-sm">—</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 text-sm bg-ds-background border border-ds-border rounded-lg text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => updateFilter("freeOnly", !filters.freeOnly ? true : undefined)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              filters.freeOnly ? "bg-ds-primary" : "bg-ds-muted"
            }`}
            role="switch"
            aria-checked={!!filters.freeOnly}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-ds-background transition-transform ${
                filters.freeOnly ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-xs font-medium text-ds-muted-foreground">
            {t(locale, "events.free_event")}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full px-3 py-2 text-sm font-medium text-ds-destructive bg-ds-destructive/10 rounded-lg hover:bg-ds-destructive/20 transition-colors"
          >
            {t(locale, "common.cancel")}
          </button>
        )}
      </div>
    </div>
  )
}
