import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { SearchInput, SearchResults, SearchFilters } from "@/components/search"
import {
  useSearch,
  useSearchCategories,
  useSearchCollections,
} from "@/lib/hooks/use-search"

interface SearchParams {
  q?: string
  category?: string
  collection?: string
}

export const Route = createFileRoute("/$countryCode/search")({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: (search.q as string) || "",
    category: search.category as string | undefined,
    collection: search.collection as string | undefined,
  }),
})

function SearchPage() {
  const { countryCode } = Route.useParams()
  const searchParams = Route.useSearch()
  const navigate = Route.useNavigate()

  const [query, setQuery] = useState(searchParams.q || "")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    searchParams.category
  )
  const [selectedCollection, setSelectedCollection] = useState<
    string | undefined
  >(searchParams.collection)

  // Update URL when filters change
  useEffect(() => {
    navigate({
      search: {
        q: query || undefined,
        category: selectedCategory,
        collection: selectedCollection,
      },
      replace: true,
    })
  }, [query, selectedCategory, selectedCollection, navigate])

  // Fetch search results
  const { data, isLoading } = useSearch(query, {
    category_id: selectedCategory,
    collection_id: selectedCollection,
  })

  // Fetch filter options
  const { data: categories = [] } = useSearchCategories()
  const { data: collections = [] } = useSearchCollections()

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-ui-fg-base mb-4">
          Search Products
        </h1>
        <div className="max-w-xl">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="What are you looking for?"
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-ui-bg-subtle rounded-lg p-4">
            <h2 className="text-sm font-medium text-ui-fg-base mb-4">
              Filters
            </h2>
            <SearchFilters
              categories={categories}
              collections={collections}
              selectedCategory={selectedCategory}
              selectedCollection={selectedCollection}
              onCategoryChange={setSelectedCategory}
              onCollectionChange={setSelectedCollection}
            />

            {/* Clear Filters */}
            {(selectedCategory || selectedCollection) && (
              <button
                onClick={() => {
                  setSelectedCategory(undefined)
                  setSelectedCollection(undefined)
                }}
                className="mt-4 w-full py-2 text-sm text-ui-fg-interactive hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <main className="lg:col-span-3">
          <SearchResults
            products={data?.products || []}
            isLoading={isLoading}
            countryCode={countryCode}
            query={query}
          />
        </main>
      </div>
    </div>
  )
}
