import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"

interface POIFilterBarProps {
  categories: string[]
  selectedCategory?: string
  onCategoryChange: (category: string | undefined) => void
  sortBy?: string
  onSortChange?: (sort: string) => void
  ratingFilter?: number
  onRatingFilterChange?: (rating: number | undefined) => void
  locale?: string
}

export function POIFilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  ratingFilter,
  onRatingFilterChange,
  locale: localeProp,
}: POIFilterBarProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-wrap gap-2 flex-1">
        <button
          onClick={() => onCategoryChange(undefined)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            !selectedCategory
              ? "bg-ds-primary text-ds-primary-foreground"
              : "bg-ds-background text-ds-muted-foreground border border-ds-border hover:bg-ds-muted"
          }`}
        >
          {t(locale, "blocks.all_categories")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(selectedCategory === cat ? undefined : cat)}
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

      <div className="flex items-center gap-2">
        {onRatingFilterChange && (
          <select
            value={ratingFilter || ""}
            onChange={(e) => onRatingFilterChange(e.target.value ? Number(e.target.value) : undefined)}
            className="px-3 py-2 text-sm rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
          >
            <option value="">{t(locale, "poi.any_rating")}</option>
            <option value="4">4+ ★</option>
            <option value="3">3+ ★</option>
            <option value="2">2+ ★</option>
          </select>
        )}

        {onSortChange && (
          <select
            value={sortBy || ""}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
          >
            <option value="">{t(locale, "poi.sort_default")}</option>
            <option value="rating">{t(locale, "poi.sort_rating")}</option>
            <option value="distance">{t(locale, "poi.sort_distance")}</option>
            <option value="name">{t(locale, "poi.sort_name")}</option>
          </select>
        )}
      </div>
    </div>
  )
}
