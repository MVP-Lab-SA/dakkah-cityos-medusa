import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductCard from "@/components/product-card"
import { Spinner } from "@medusajs/icons"

type SortOption = "relevance" | "price_asc" | "price_desc" | "newest"

interface SearchResultsProps {
  products: HttpTypes.StoreProduct[]
  isLoading: boolean
  query: string
  filters?: {
    category?: string
    priceMin?: number
    priceMax?: number
  }
  sort?: SortOption
  totalCount?: number
  hasMore?: boolean
  onLoadMore?: () => void
  onSortChange?: (sort: SortOption) => void
}

const suggestedSearches = [
  "Try searching for electronics",
  "Browse our clothing collection",
  "Check out home & garden items",
]

export function SearchResults({
  products,
  isLoading,
  query,
  filters,
  sort = "relevance",
  totalCount,
  hasMore = false,
  onLoadMore,
  onSortChange,
}: SearchResultsProps) {
  const [loadingMore, setLoadingMore] = useState(false)

  const handleLoadMore = async () => {
    if (onLoadMore) {
      setLoadingMore(true)
      onLoadMore()
      setTimeout(() => setLoadingMore(false), 1000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="w-8 h-8 animate-spin text-ds-muted-foreground" />
      </div>
    )
  }

  if (!query || query.length < 2) {
    return (
      <div className="text-center py-12">
        <p className="text-ds-muted-foreground">
          Enter at least 2 characters to search
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ds-muted flex items-center justify-center">
          <svg className="w-8 h-8 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <p className="text-ds-foreground text-lg font-medium mb-1">
          No results found for &ldquo;{query}&rdquo;
        </p>
        <p className="text-ds-muted-foreground text-sm mb-6">
          Try adjusting your search or browse our categories
        </p>
        <div className="space-y-2">
          <p className="text-xs text-ds-muted-foreground font-medium">
            Suggestions:
          </p>
          {suggestedSearches.map((suggestion) => (
            <p key={suggestion} className="text-sm text-ds-primary">
              {suggestion}
            </p>
          ))}
        </div>
      </div>
    )
  }

  const displayCount = totalCount ?? products.length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ds-muted-foreground">
          {displayCount} result{displayCount !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          {filters?.category && (
            <span className="ml-1">
              in <span className="font-medium text-ds-foreground">{filters.category}</span>
            </span>
          )}
        </p>
        {onSortChange && (
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-1.5 text-sm rounded-lg border border-ds-border bg-ds-card text-ds-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && onLoadMore && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 text-sm font-medium rounded-lg border border-ds-border bg-ds-card text-ds-foreground hover:bg-ds-muted transition-colors disabled:opacity-50"
          >
            {loadingMore ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  )
}
