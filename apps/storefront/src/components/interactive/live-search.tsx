import { useState, useRef, useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface SearchResult {
  id: string
  title: string
  category?: string
  image?: string
  price?: string
  href: string
}

interface LiveSearchProps {
  locale?: string
  onSearch?: (query: string) => Promise<SearchResult[]>
  trending?: string[]
  recentSearches?: string[]
  onNavigate?: (href: string) => void
  placeholder?: string
}

export function LiveSearch({
  locale: localeProp,
  onSearch,
  trending = [],
  recentSearches = [],
  onNavigate,
  placeholder,
}: LiveSearchProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (typeof window !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 2) {
      setResults([])
      setIsOpen(value.length > 0 || trending.length > 0 || recentSearches.length > 0)
      return
    }
    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      if (onSearch) {
        const res = await onSearch(value)
        setResults(res)
      }
      setIsLoading(false)
      setIsOpen(true)
    }, 300)
  }

  const showSuggestions = isOpen && query.length < 2 && (trending.length > 0 || recentSearches.length > 0)
  const showResults = isOpen && query.length >= 2

  return (
    <div ref={containerRef} className="relative w-full" id="search">
      <div className="relative">
        <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || t(locale, "common.search")}
          className="w-full ps-10 pe-4 py-2.5 text-sm bg-ds-accent border border-ds-border rounded-lg text-ds-text placeholder:text-ds-muted focus:outline-none focus:ring-2 focus:ring-ds-primary"
          aria-label={t(locale, "common.search")}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setIsOpen(false) }}
            className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-ds-muted hover:text-ds-text"
            aria-label={t(locale, "common.close")}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute top-full mt-1 w-full bg-ds-card border border-ds-border rounded-lg shadow-lg z-50 p-3 max-h-80 overflow-y-auto">
          {recentSearches.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-ds-muted mb-2">{t(locale, "search.recent")}</h4>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => handleChange(term)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-ds-text hover:bg-ds-accent rounded-md transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {term}
                </button>
              ))}
            </div>
          )}
          {trending.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-ds-muted mb-2">{t(locale, "search.trending")}</h4>
              <div className="flex flex-wrap gap-1.5">
                {trending.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleChange(term)}
                    className="px-2.5 py-1 text-xs bg-ds-accent text-ds-text border border-ds-border rounded-full hover:border-ds-primary transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showResults && (
        <div className="absolute top-full mt-1 w-full bg-ds-card border border-ds-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto" role="listbox">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-ds-muted">{t(locale, "common.loading")}</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-ds-muted">{t(locale, "search.no_results")}</div>
          ) : (
            results.map((result) => (
              <button
                key={result.id}
                role="option"
                className="flex items-center gap-3 w-full p-3 hover:bg-ds-accent transition-colors text-start"
                onClick={() => {
                  onNavigate?.(result.href)
                  setIsOpen(false)
                  setQuery("")
                }}
              >
                {result.image && (
                  <img src={result.image} alt={result.title} className="w-10 h-10 rounded object-cover bg-ds-accent" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ds-text truncate">{result.title}</p>
                  {result.category && (
                    <p className="text-xs text-ds-muted">{result.category}</p>
                  )}
                </div>
                {result.price && (
                  <span className="text-sm font-medium text-ds-primary flex-shrink-0">{result.price}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
