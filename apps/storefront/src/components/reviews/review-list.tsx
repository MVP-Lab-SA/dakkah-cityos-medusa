import { ReviewCard } from "./review-card"
import { ReviewSummary } from "./review-summary"
import { Spinner } from "@medusajs/icons"

interface Review {
  id: string
  rating: number
  title?: string
  content: string
  customer_name?: string
  is_verified_purchase: boolean
  helpful_count: number
  images: string[]
  created_at: string
}

interface ReviewListProps {
  reviews: Review[]
  summary?: {
    average_rating: number
    total_reviews: number
    rating_distribution: Record<number, number>
  }
  isLoading?: boolean
  showSummary?: boolean
}

export function ReviewList({
  reviews,
  summary,
  isLoading,
  showSummary = true,
}: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="w-8 h-8 animate-spin text-ui-fg-muted" />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ui-fg-muted">No reviews yet</p>
        <p className="text-sm text-ui-fg-subtle mt-1">
          Be the first to share your experience
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {showSummary && summary && (
        <ReviewSummary summary={summary} />
      )}

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
