import React from 'react'

interface ProductDetailBlockProps {
  productId?: string
  showReviews?: boolean
  showRelated?: boolean
  variant?: 'default' | 'compact' | 'full'
}

export const ProductDetailBlock: React.FC<ProductDetailBlockProps> = ({
  productId,
  showReviews = true,
  showRelated = true,
  variant = 'default',
}) => {
  const [selectedVariant, setSelectedVariant] = React.useState(0)
  const [activeTab, setActiveTab] = React.useState<'description' | 'specs' | 'reviews'>('description')
  const [quantity, setQuantity] = React.useState(1)

  const placeholderVariants = ['Small', 'Medium', 'Large', 'XL']
  const placeholderImages = [0, 1, 2, 3]

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="bg-ds-muted aspect-square rounded-lg animate-pulse" />
            <div className="grid grid-cols-4 gap-2">
              {placeholderImages.map((i) => (
                <div
                  key={i}
                  className="bg-ds-muted aspect-square rounded-md cursor-pointer border-2 border-transparent hover:border-ds-primary transition-colors"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-sm text-ds-muted-foreground">Brand Name</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-4">
              Product Title
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-ds-foreground">$99.99</span>
              <span className="text-lg text-ds-muted-foreground line-through">$129.99</span>
              <span className="text-sm font-medium text-ds-destructive">-23%</span>
            </div>

            <div className="flex items-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-5 h-5 ${star <= 4 ? 'text-ds-warning' : 'text-ds-muted'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-ds-muted-foreground ms-2">(128 reviews)</span>
            </div>

            <div className="mb-6">
              <span className="text-sm font-medium text-ds-foreground mb-2 block">Variant</span>
              <div className="flex flex-wrap gap-2">
                {placeholderVariants.map((v, i) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSelectedVariant(i)}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                      selectedVariant === i
                        ? 'border-ds-primary bg-ds-primary text-ds-primary-foreground'
                        : 'border-ds-border text-ds-foreground hover:bg-ds-muted'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <span className="text-sm font-medium text-ds-foreground mb-2 block">Quantity</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-md border border-ds-border text-ds-foreground hover:bg-ds-muted flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-12 text-center text-ds-foreground font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-md border border-ds-border text-ds-foreground hover:bg-ds-muted flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                type="button"
                className="flex-1 py-3 px-6 rounded-lg bg-ds-primary text-ds-primary-foreground font-semibold hover:bg-ds-primary/90 transition-colors"
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="py-3 px-6 rounded-lg border border-ds-border text-ds-foreground font-semibold hover:bg-ds-muted transition-colors"
              >
                <svg className="w-5 h-5 inline-block me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Wishlist
              </button>
            </div>

            <div className="border-t border-ds-border pt-6">
              <div className="flex border-b border-ds-border">
                {(['description', 'specs', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-4 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-b-2 border-ds-primary text-ds-foreground'
                        : 'text-ds-muted-foreground hover:text-ds-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="py-4">
                {activeTab === 'description' && (
                  <div className="space-y-3">
                    <div className="h-4 bg-ds-muted rounded w-full" />
                    <div className="h-4 bg-ds-muted rounded w-5/6" />
                    <div className="h-4 bg-ds-muted rounded w-4/6" />
                    <div className="h-4 bg-ds-muted rounded w-full" />
                    <div className="h-4 bg-ds-muted rounded w-3/4" />
                  </div>
                )}
                {activeTab === 'specs' && (
                  <div className="space-y-2">
                    {['Material', 'Weight', 'Dimensions', 'Color'].map((spec) => (
                      <div key={spec} className="flex justify-between py-2 border-b border-ds-border last:border-0">
                        <span className="text-sm text-ds-muted-foreground">{spec}</span>
                        <div className="h-4 bg-ds-muted rounded w-24" />
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'reviews' && showReviews && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b border-ds-border pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-ds-muted" />
                          <div className="h-4 bg-ds-muted rounded w-24" />
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <svg key={s} className={`w-4 h-4 ${s <= 4 ? 'text-ds-warning' : 'text-ds-muted'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <div className="h-4 bg-ds-muted rounded w-full mb-1" />
                        <div className="h-4 bg-ds-muted rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showRelated && (
          <div className="mt-16">
            <h2 className="text-xl md:text-2xl font-bold text-ds-foreground mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-ds-muted aspect-square rounded-lg mb-4" />
                  <div className="h-4 bg-ds-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-ds-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
