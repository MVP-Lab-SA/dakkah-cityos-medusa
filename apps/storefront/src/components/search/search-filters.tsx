import { HttpTypes } from "@medusajs/types"
import { clsx as clx } from "clsx"

interface SearchFiltersProps {
  categories: HttpTypes.StoreProductCategory[]
  collections: HttpTypes.StoreCollection[]
  selectedCategory?: string
  selectedCollection?: string
  onCategoryChange: (categoryId: string | undefined) => void
  onCollectionChange: (collectionId: string | undefined) => void
}

export function SearchFilters({
  categories,
  collections,
  selectedCategory,
  selectedCollection,
  onCategoryChange,
  onCollectionChange,
}: SearchFiltersProps) {
  // Filter to only top-level categories
  const topLevelCategories = categories.filter(
    (c) => !c.parent_category_id
  )

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-ui-fg-base mb-3">Categories</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onCategoryChange(undefined)}
              className={clx(
                "text-sm w-full text-left px-2 py-1 rounded hover:bg-ui-bg-base-hover transition-colors",
                !selectedCategory
                  ? "text-ui-fg-base font-medium"
                  : "text-ui-fg-muted"
              )}
            >
              All Categories
            </button>
          </li>
          {topLevelCategories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onCategoryChange(category.id)}
                className={clx(
                  "text-sm w-full text-left px-2 py-1 rounded hover:bg-ui-bg-base-hover transition-colors",
                  selectedCategory === category.id
                    ? "text-ui-fg-base font-medium"
                    : "text-ui-fg-muted"
                )}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Collections */}
      {collections.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-ui-fg-base mb-3">
            Collections
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onCollectionChange(undefined)}
                className={clx(
                  "text-sm w-full text-left px-2 py-1 rounded hover:bg-ui-bg-base-hover transition-colors",
                  !selectedCollection
                    ? "text-ui-fg-base font-medium"
                    : "text-ui-fg-muted"
                )}
              >
                All Collections
              </button>
            </li>
            {collections.map((collection) => (
              <li key={collection.id}>
                <button
                  onClick={() => onCollectionChange(collection.id)}
                  className={clx(
                    "text-sm w-full text-left px-2 py-1 rounded hover:bg-ui-bg-base-hover transition-colors",
                    selectedCollection === collection.id
                      ? "text-ui-fg-base font-medium"
                      : "text-ui-fg-muted"
                  )}
                >
                  {collection.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
