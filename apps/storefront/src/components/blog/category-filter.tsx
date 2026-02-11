import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"

interface CategoryFilterProps {
  categories: { name: string; slug: string; count?: number }[]
  selectedCategory?: string
  onSelect: (slug: string | undefined) => void
  locale?: string
}

export function CategoryFilter({ categories, selectedCategory, onSelect, locale: localeProp }: CategoryFilterProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(undefined)}
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
          key={cat.slug}
          onClick={() => onSelect(selectedCategory === cat.slug ? undefined : cat.slug)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            selectedCategory === cat.slug
              ? "bg-ds-primary text-ds-primary-foreground"
              : "bg-ds-background text-ds-muted-foreground border border-ds-border hover:bg-ds-muted"
          }`}
        >
          {cat.name}
          {cat.count !== undefined && (
            <span className="ms-1.5 text-xs opacity-70">({cat.count})</span>
          )}
        </button>
      ))}
    </div>
  )
}
