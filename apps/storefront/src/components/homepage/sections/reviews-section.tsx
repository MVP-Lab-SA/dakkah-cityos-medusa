import { Star } from "@medusajs/icons"

interface Review {
  id: string
  rating: number
  title?: string
  content: string
  customer_name?: string
  product_name?: string
  created_at: string
  is_verified_purchase?: boolean
}

interface ReviewsSectionProps {
  reviews: Review[]
  config: Record<string, any>
}

export function ReviewsSection({ reviews, config }: ReviewsSectionProps) {
  if (reviews.length === 0) return null

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-ds-warning fill-ds-warning' 
                : 'text-ds-muted-foreground'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <section className="py-16 bg-ds-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">
            {config.title || "What Our Customers Say"}
          </h2>
          <p className="mt-4 text-ds-muted-foreground">
            {config.subtitle || "Real reviews from real customers"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map(review => (
            <div
              key={review.id}
              className="bg-ds-muted rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                {renderStars(review.rating)}
                {review.is_verified_purchase && (
                  <span className="text-xs bg-ds-success text-ds-success px-2 py-1 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              {review.title && (
                <h3 className="font-semibold text-ds-foreground mb-2">
                  {review.title}
                </h3>
              )}
              <p className="text-ds-muted-foreground text-sm line-clamp-4 mb-4">
                "{review.content}"
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ds-foreground">
                  {review.customer_name || "Anonymous"}
                </span>
                <span className="text-ds-muted-foreground">
                  {formatDate(review.created_at)}
                </span>
              </div>
              {review.product_name && (
                <p className="mt-2 text-xs text-ds-muted-foreground">
                  Review for: {review.product_name}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
