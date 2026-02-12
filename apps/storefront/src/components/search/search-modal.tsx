import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "@tanstack/react-router"
import { XMark } from "@medusajs/icons"
import { SearchInput } from "./search-input"
import { SearchSuggestions } from "./search-suggestions"
import { useSearchSuggestions } from "@/lib/hooks/use-search"
import { useTenantPrefix } from "@/lib/context/tenant-context"

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

type SortOption = "relevance" | "price_asc" | "price_desc" | "newest"

const RECENT_SEARCHES_KEY = "dakkah_recent_searches"
const MAX_RECENT = 8

const popularSearches = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Beauty",
]

const categoryFilters = [
  "All",
  "Electronics",
  "Clothing",
  "Home",
  "Sports",
  "Beauty",
  "Books",
  "Toys",
]

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function addRecentSearch(query: string) {
  const recent = getRecentSearches().filter((s) => s !== query)
  recent.unshift(query)
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT))
  )
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY)
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()
  const tenantPrefix = useTenantPrefix()
  const { data: suggestions = [] } = useSearchSuggestions(debouncedQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches())
    }
  }, [open])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  const handleSubmit = useCallback(() => {
    if (query.length >= 2) {
      addRecentSearch(query)
      const params = new URLSearchParams({ q: query })
      if (selectedCategory !== "All") params.set("category", selectedCategory)
      if (sortBy !== "relevance") params.set("sort", sortBy)
      if (priceMin) params.set("price_min", priceMin)
      if (priceMax) params.set("price_max", priceMax)
      window.location.href = `${tenantPrefix}/search?${params.toString()}`
      onClose()
      setQuery("")
    }
  }, [query, selectedCategory, sortBy, priceMin, priceMax, tenantPrefix, onClose])

  const handleSelect = () => {
    if (query) addRecentSearch(query)
    onClose()
    setQuery("")
  }

  const handleRecentClick = (term: string) => {
    setQuery(term)
    addRecentSearch(term)
    window.location.href = `${tenantPrefix}/search?q=${encodeURIComponent(term)}`
    onClose()
  }

  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-w-2xl mx-auto mt-4 sm:mt-20 px-4 h-full sm:h-auto">
        <div className="bg-ds-card rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[80vh]">
          <div className="flex items-center justify-between p-4 border-b border-ds-border">
            <h2 className="text-lg font-medium text-ds-foreground">Search</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters
                    ? "bg-ds-primary/10 text-ds-primary"
                    : "text-ds-muted-foreground hover:bg-ds-muted"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-ds-muted rounded-lg transition-colors"
              >
                <XMark className="w-5 h-5 text-ds-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="p-4 relative">
            <SearchInput
              value={query}
              onChange={setQuery}
              autoFocus
              onSubmit={handleSubmit}
              placeholder="Search for products..."
            />

            {suggestions.length > 0 && (
              <SearchSuggestions
                suggestions={suggestions}
                tenantPrefix={tenantPrefix}
                onSelect={handleSelect}
              />
            )}
          </div>

          {showFilters && (
            <div className="px-4 pb-4 space-y-4 border-b border-ds-border">
              <div>
                <p className="text-xs font-medium text-ds-muted-foreground mb-2">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedCategory === cat
                          ? "bg-ds-primary text-ds-primary-foreground border-ds-primary"
                          : "bg-ds-card text-ds-muted-foreground border-ds-border hover:bg-ds-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-ds-muted-foreground mb-2">
                    Price Range
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary"
                    />
                    <span className="text-ds-muted-foreground">–</span>
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xs font-medium text-ds-muted-foreground mb-2">
                    Sort By
                  </p>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {!query && (
              <div className="p-4 space-y-6">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-ds-muted-foreground">
                        Recent Searches
                      </p>
                      <button
                        onClick={handleClearRecent}
                        className="text-xs text-ds-primary hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleRecentClick(term)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-ds-muted text-ds-foreground border border-ds-border rounded-full hover:bg-ds-muted/80 transition-colors"
                        >
                          <svg className="w-3 h-3 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-ds-muted-foreground mb-2">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="px-3 py-1 text-sm bg-ds-card text-ds-foreground border border-ds-border rounded-full hover:bg-ds-muted transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-ds-border bg-ds-muted/30">
            <p className="text-center text-xs text-ds-muted-foreground">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-ds-card rounded text-ds-muted-foreground border border-ds-border">
                ESC
              </kbd>{" "}
              to close
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
