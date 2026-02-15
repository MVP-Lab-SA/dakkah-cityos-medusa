import React from 'react'

interface VendorProfileBlockProps {
  vendorId?: string
  showRating?: boolean
  showProducts?: boolean
  showStats?: boolean
  layout?: 'default' | 'compact' | 'hero'
}

export const VendorProfileBlock: React.FC<VendorProfileBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  vendorId,
  showRating = true,
  showProducts = true,
  showStats = true,
  layout = 'default',
}) => {
  const stats = [
    { label: 'Products', value: '248' },
    { label: 'Sales', value: '1.2K' },
    { label: 'Rating', value: '4.8' },
    { label: 'Since', value: '2022' },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className={layout === 'hero' ? '' : 'max-w-4xl mx-auto'}>
          <div className="relative rounded-xl overflow-hidden mb-6">
            <div className="h-32 md:h-48 bg-gradient-to-r from-ds-primary/20 to-ds-primary/5" />
            <div className="absolute -bottom-12 start-6 md:start-8">
              <div className="w-24 h-24 rounded-full border-4 border-ds-background bg-ds-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-ds-muted-foreground">V</span>
              </div>
            </div>
          </div>

          <div className="pt-14 px-2">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-ds-foreground">Vendor Store Name</h1>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-ds-primary/10 text-ds-primary">Verified</span>
                </div>
                <p className="text-ds-muted-foreground mt-1 max-w-xl">
                  A curated collection of premium products. We are committed to quality and customer satisfaction since 2022.
                </p>

                {showRating && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-5 h-5 ${star <= 4 ? 'text-ds-warning' : 'text-ds-muted'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-ds-muted-foreground">4.8 (356 reviews)</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="px-6 py-2.5 rounded-lg border border-ds-border text-ds-foreground text-sm font-semibold hover:bg-ds-muted transition-colors self-start"
              >
                Follow Store
              </button>
            </div>

            {showStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-ds-card border border-ds-border rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-ds-foreground">{stat.value}</p>
                    <p className="text-sm text-ds-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {showProducts && (
              <div className="mt-10">
                <h2 className="text-lg md:text-xl font-bold text-ds-foreground mb-4">Featured Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-ds-muted aspect-square rounded-lg mb-3" />
                      <div className="h-4 bg-ds-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-ds-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
