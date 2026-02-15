import React from 'react'

interface WishlistGridBlockProps {
  heading?: string
  columns?: 2 | 3 | 4
  showMoveToCart?: boolean
  emptyMessage?: string
}

export const WishlistGridBlock: React.FC<WishlistGridBlockProps> = ({
  heading = 'My Wishlist',
  columns = 3,
  showMoveToCart = true,
  emptyMessage = 'Your wishlist is empty. Start adding items you love!',
}) => {
  const placeholderItems = [
    { id: 1, name: 'Wireless Headphones', price: 79.99, originalPrice: 99.99 },
    { id: 2, name: 'Leather Backpack', price: 149.99 },
    { id: 3, name: 'Smart Watch', price: 299.99, originalPrice: 349.99 },
    { id: 4, name: 'Running Shoes', price: 129.99 },
    { id: 5, name: 'Sunglasses', price: 59.99 },
    { id: 6, name: 'Water Bottle', price: 24.99 },
  ]

  const gridCols: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  const isEmpty = false

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-8">{heading}</h2>
        )}

        {isEmpty ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ds-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-ds-muted-foreground">{emptyMessage}</p>
            <button
              type="button"
              className="mt-4 px-6 py-2.5 rounded-lg bg-ds-primary text-ds-primary-foreground text-sm font-semibold hover:bg-ds-primary/90 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
            {placeholderItems.map((item) => (
              <div key={item.id} className="bg-ds-card border border-ds-border rounded-lg overflow-hidden group">
                <div className="relative">
                  <div className="bg-ds-muted aspect-square" />
                  <button
                    type="button"
                    className="absolute top-2 end-2 w-8 h-8 rounded-full bg-ds-background/80 text-ds-destructive hover:bg-ds-background flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-ds-foreground mb-2 truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-ds-foreground">${item.price.toFixed(2)}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-ds-muted-foreground line-through">${item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  {showMoveToCart && (
                    <button
                      type="button"
                      className="w-full py-2 rounded-md bg-ds-primary text-ds-primary-foreground text-sm font-medium hover:bg-ds-primary/90 transition-colors"
                    >
                      Move to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
