import React from 'react'

interface VendorProductsBlockProps {
  vendorId?: string
  limit?: number
  showFilters?: boolean
  columns?: 2 | 3 | 4
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular'
}

export const VendorProductsBlock: React.FC<VendorProductsBlockProps> = ({
  vendorId,
  limit = 12,
  showFilters = true,
  columns = 3,
  sortBy = 'newest',
}) => {
  const [activeSort, setActiveSort] = React.useState(sortBy)
  const [activeCategory, setActiveCategory] = React.useState('all')

  const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Accessories']

  const gridCols: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  const placeholderProducts = Array.from({ length: limit }, (_, i) => ({
    id: i + 1,
    name: `Vendor Product ${i + 1}`,
    price: (Math.random() * 200 + 9.99).toFixed(2),
    rating: (Math.random() * 2 + 3).toFixed(1),
  }))

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {showFilters && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.toLowerCase()
                      ? 'bg-ds-primary text-ds-primary-foreground'
                      : 'bg-ds-muted text-ds-foreground hover:bg-ds-muted/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-ds-muted-foreground">Sort by:</label>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as typeof sortBy)}
                className="px-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        )}

        <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
          {placeholderProducts.map((product) => (
            <div key={product.id} className="bg-ds-card border border-ds-border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
              <div className="bg-ds-muted aspect-square" />
              <div className="p-4">
                <h3 className="text-sm font-medium text-ds-foreground truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-ds-foreground">${product.price}</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-ds-warning" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs text-ds-muted-foreground">{product.rating}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full mt-3 py-2 rounded-md border border-ds-border text-ds-foreground text-sm font-medium hover:bg-ds-muted transition-colors opacity-0 group-hover:opacity-100"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="button"
            className="px-6 py-2.5 rounded-lg border border-ds-border text-ds-foreground text-sm font-semibold hover:bg-ds-muted transition-colors"
          >
            Load More
          </button>
        </div>
      </div>
    </section>
  )
}
