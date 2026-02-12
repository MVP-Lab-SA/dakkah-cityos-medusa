import React from 'react'

interface RecentlyViewedBlockProps {
  heading?: string
  limit?: number
  layout?: 'grid' | 'carousel'
}

export const RecentlyViewedBlock: React.FC<RecentlyViewedBlockProps> = ({
  heading = 'Recently Viewed',
  limit = 8,
  layout = 'carousel',
}) => {
  const placeholderItems = Array.from({ length: limit }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (Math.random() * 200 + 19.99).toFixed(2),
  }))

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-ds-muted">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-xl md:text-2xl font-bold text-ds-foreground mb-6">{heading}</h2>
        )}

        {layout === 'carousel' ? (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {placeholderItems.map((item) => (
              <div
                key={item.id}
                className="min-w-[200px] md:min-w-[240px] flex-shrink-0 snap-start bg-ds-card border border-ds-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-ds-background aspect-square" />
                <div className="p-3">
                  <h3 className="text-sm font-medium text-ds-foreground truncate">{item.name}</h3>
                  <p className="text-sm font-semibold text-ds-foreground mt-1">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {placeholderItems.map((item) => (
              <div
                key={item.id}
                className="bg-ds-card border border-ds-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-ds-background aspect-square" />
                <div className="p-3">
                  <h3 className="text-sm font-medium text-ds-foreground truncate">{item.name}</h3>
                  <p className="text-sm font-semibold text-ds-foreground mt-1">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
