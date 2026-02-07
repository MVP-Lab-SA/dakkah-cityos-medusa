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
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-200"
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
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-start gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-zinc-900">{averageRating.toFixed(1)}</p>
              <div className="flex justify-center mt-2">{renderStars(Math.round(averageRating))}</div>
              <p className="text-sm text-zinc-500 mt-1">{totalReviews} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distribution[rating as keyof typeof distribution]
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm text-zinc-600 w-3">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-zinc-400 w-8">{count}</span>
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
          <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
            <p className="text-zinc-500">No reviews yet</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-zinc-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-zinc-900">{review.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-zinc-400">{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
              {review.product && (
                <p className="text-sm text-zinc-500 mb-2">Purchased: {review.product}</p>
              )}
              <p className="text-zinc-600">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
