import React from 'react'
import { Rating } from '../ui/rating'
import { Badge } from '../ui/badge'

interface Vendor {
  id: string
  name: string
  slug?: string
  logo?: string
  description?: string
  rating?: {
    average: number
    count: number
  }
  productCount?: number
  verified?: boolean
}

interface VendorShowcaseBlockProps {
  heading?: string
  description?: string
  vendors: Vendor[]
  layout?: 'grid' | 'carousel' | 'featured'
  showRating?: boolean
  showProducts?: boolean
}

export const VendorShowcaseBlock: React.FC<VendorShowcaseBlockProps> = ({
  heading,
  description,
  vendors,
  layout = 'grid',
  showRating = true,
  showProducts = false,
}) => {
  const gridClass =
    layout === 'featured'
      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
      : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'

  const carouselClass = 'flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory'

  return (
    <section className="w-full py-12 px-4">
      <div className="container mx-auto">
        {heading && (
          <h2 className="text-3xl font-bold text-ds-foreground mb-2">{heading}</h2>
        )}
        {description && (
          <p className="text-ds-muted-foreground mb-8 max-w-2xl">{description}</p>
        )}

        <div className={layout === 'carousel' ? carouselClass : gridClass}>
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className={`rounded-lg border border-ds-border bg-ds-card p-4 flex flex-col items-center text-center transition-shadow hover:shadow-md ${
                layout === 'carousel' ? 'min-w-[240px] snap-start flex-shrink-0' : ''
              } ${layout === 'featured' ? 'p-6' : ''}`}
            >
              {vendor.logo ? (
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="w-16 h-16 rounded-full object-cover mb-3"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-ds-muted flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-ds-muted-foreground">
                    {vendor.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-ds-foreground">{vendor.name}</h3>
                {vendor.verified && <Badge variant="success" size="sm">Verified</Badge>}
              </div>

              {vendor.description && layout === 'featured' && (
                <p className="text-sm text-ds-muted-foreground mb-2 line-clamp-2">
                  {vendor.description}
                </p>
              )}

              {showRating && vendor.rating && (
                <Rating
                  value={vendor.rating.average}
                  count={vendor.rating.count}
                  size="sm"
                  showValue
                />
              )}

              {showProducts && vendor.productCount !== undefined && (
                <span className="text-xs text-ds-muted-foreground mt-2">
                  {vendor.productCount} products
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
