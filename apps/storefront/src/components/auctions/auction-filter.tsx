import { t } from "@/lib/i18n"
import { useState } from "react"

interface AuctionFilters {
  auctionType?: string
  status?: string
  minPrice?: number
  maxPrice?: number
}

interface AuctionFilterProps {
  locale: string
  filters: AuctionFilters
  onFilterChange: (filters: AuctionFilters) => void
}

const AUCTION_TYPES = ["english", "dutch", "sealed", "reserve"] as const
const STATUSES = ["active", "scheduled", "ended"] as const

export function AuctionFilter({ locale, filters, onFilterChange }: AuctionFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof AuctionFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value || undefined })
  }

  const clearFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined)

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
            {t(locale, "auction.title")} Type
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter("auctionType", undefined)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                !filters.auctionType
                  ? "bg-ds-primary text-ds-primary-foreground"
                  : "bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground"
              }`}
            >
              {t(locale, "blocks.all_categories")}
            </button>
            {AUCTION_TYPES.map((type) => (
              <button
                key={type}
                onClick={() =>
                  updateFilter("auctionType", filters.auctionType === type ? undefined : type)
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  filters.auctionType === type
                    ? "bg-ds-primary text-ds-primary-foreground"
                    : "bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground"
                }`}
              >
                {t(locale, `auction.${type}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ds-muted-foreground mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter("status", undefined)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                !filters.status
                  ? "bg-ds-primary text-ds-primary-foreground"
                  : "bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground"
              }`}
            >
              {t(locale, "blocks.all_categories")}
            </button>
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() =>
                  updateFilter("status", filters.status === status ? undefined : status)
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  filters.status === status
                    ? "bg-ds-primary text-ds-primary-foreground"
                    : "bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground"
                }`}
              >
                {t(locale, `auction.${status}`)}
              </button>
            ))}
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
