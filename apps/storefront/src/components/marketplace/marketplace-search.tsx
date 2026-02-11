import { useState, useCallback } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

type FilterType = "all" | "vendors" | "products"
type SortOption = "relevance" | "rating" | "price_low" | "price_high"

interface MarketplaceSearchProps {
  locale?: string
  onSearch?: (query: string, filter: FilterType, sort: SortOption) => void
  initialQuery?: string
  resultCount?: number
}

export function MarketplaceSearch({ locale: localeProp, onSearch, initialQuery = "", resultCount }: MarketplaceSearchProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [query, setQuery] = useState(initialQuery)
  const [filter, setFilter] = useState<FilterType>("all")
  const [sort, setSort] = useState<SortOption>("relevance")

  const handleSearch = useCallback(() => {
    onSearch?.(query, filter, sort)
  }, [query, filter, sort, onSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: t(locale, "marketplace.filter_all") },
    { value: "vendors", label: t(locale, "marketplace.filter_vendors") },
    { value: "products", label: t(locale, "marketplace.filter_products") },
  ]

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "relevance", label: t(locale, "marketplace.sort_relevance") },
    { value: "rating", label: t(locale, "marketplace.sort_rating") },
    { value: "price_low", label: t(locale, "marketplace.sort_price_low") },
    { value: "price_high", label: t(locale, "marketplace.sort_price_high") },
  ]

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t(locale, "marketplace.search_placeholder")}
            className="w-full ps-10 pe-4 py-2.5 rounded-lg border border-ds-border bg-ds-card text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary/50 text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-1 bg-ds-muted rounded-lg p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setFilter(f.value)
                onSearch?.(query, f.value, sort)
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-ds-card text-ds-foreground shadow-sm"
                  : "text-ds-muted-foreground hover:text-ds-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {resultCount !== undefined && (
            <span className="text-sm text-ds-muted-foreground">
              {resultCount} {t(locale, "marketplace.results_for")} &ldquo;{query}&rdquo;
            </span>
          )}
          <select
            value={sort}
            onChange={(e) => {
              const newSort = e.target.value as SortOption
              setSort(newSort)
              onSearch?.(query, filter, newSort)
            }}
            className="px-3 py-1.5 rounded-lg border border-ds-border bg-ds-card text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(locale, "marketplace.sort_by")}: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
