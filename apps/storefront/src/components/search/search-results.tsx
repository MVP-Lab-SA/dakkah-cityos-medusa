import { HttpTypes } from "@medusajs/types"
import ProductCard from "@/components/product-card"
import { Spinner } from "@medusajs/icons"

interface SearchResultsProps {
  products: HttpTypes.StoreProduct[]
  isLoading: boolean
  countryCode: string
  query: string
}

export function SearchResults({
  products,
  isLoading,
  countryCode,
  query,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="w-8 h-8 animate-spin text-ui-fg-muted" />
      </div>
    )
  }

  if (!query || query.length < 2) {
    return (
      <div className="text-center py-12">
        <p className="text-ui-fg-muted">
          Enter at least 2 characters to search
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ui-fg-muted text-lg">
          No products found for "{query}"
        </p>
        <p className="text-ui-fg-subtle mt-2">
          Try adjusting your search or browse our categories
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-ui-fg-muted mb-6">
        {products.length} result{products.length !== 1 ? "s" : ""} for "{query}"
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  )
}
