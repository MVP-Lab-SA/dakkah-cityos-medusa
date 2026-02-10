import { Star } from "@medusajs/icons"

interface Review {
  id: string
  author: string
  rating: number
  date: string
  content: string
  product?: string
}

interface VendorReviewsProps {
  reviews: Review[]
  averageRating?: number
  totalReviews?: number
}

export function VendorReviews({ reviews, averageRating, totalReviews }: VendorReviewsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-ds-warning fill-ds-warning" : "text-ds-muted-foreground"
            }`}
          />
        ))}
      </div>
    )
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
      const rounded = Math.round(review.rating) as keyof typeof distribution
      if (rounded in distribution) distribution[rounded]++
    })
    return distribution
  }

  const distribution = getRatingDistribution()

  return (
    <div className="space-y-6">
      {/* Summary */}
      {averageRating !== undefined && (
        <div className="bg-ds-background rounded-xl border border-ds-border p-6">
          <div className="flex items-start gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-ds-foreground">{averageRating.toFixed(1)}</p>
              <div className="flex justify-center mt-2">{renderStars(Math.round(averageRating))}</div>
              <p className="text-sm text-ds-muted-foreground mt-1">{totalReviews} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distribution[rating as keyof typeof distribution]
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm text-ds-muted-foreground w-3">{rating}</span>
                    <Star className="w-4 h-4 text-ds-warning fill-ds-warning" />
                    <div className="flex-1 h-2 bg-ds-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ds-warning rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-ds-muted-foreground w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-ds-background rounded-xl border border-ds-border p-8 text-center">
            <p className="text-ds-muted-foreground">No reviews yet</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-ds-background rounded-xl border border-ds-border p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-ds-foreground">{review.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-ds-muted-foreground">{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
              {review.product && (
                <p className="text-sm text-ds-muted-foreground mb-2">Purchased: {review.product}</p>
              )}
              <p className="text-ds-muted-foreground">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
