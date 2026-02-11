import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"

interface FAQSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  value?: string
  loading?: boolean
  locale?: string
}

export function FAQSearch({
  onSearch,
  placeholder,
  value,
  loading = false,
  locale: localeProp,
}: FAQSearchProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className="bg-ds-primary rounded-xl p-8 text-center">
      <h2 className="text-2xl font-bold text-ds-primary-foreground mb-2">
        {t(locale, "faq.help_center")}
      </h2>
      <p className="text-ds-primary-foreground/80 mb-6">
        {t(locale, "faq.search_description")}
      </p>
      <div className="max-w-lg mx-auto relative">
        <svg
          className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ds-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder || t(locale, "faq.search_placeholder")}
          className="w-full ps-12 pe-4 py-3 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
        />
        {loading && (
          <div className="absolute end-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-ds-muted-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
