import { StarRating } from "./star-rating"
import { clsx as clx } from "clsx"

interface ReviewSummaryProps {
  summary: {
    average_rating: number
    total_reviews: number
    rating_distribution: Record<number, number>
  }
}

export function ReviewSummary({ summary }: ReviewSummaryProps) {
  const maxCount = Math.max(...Object.values(summary.rating_distribution), 1)

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-ui-bg-subtle rounded-lg">
      {/* Average Rating */}
      <div className="text-center md:text-left">
        <div className="text-5xl font-bold text-ui-fg-base mb-2">
          {summary.average_rating.toFixed(1)}
        </div>
        <StarRating rating={summary.average_rating} size="lg" />
        <p className="text-sm text-ui-fg-muted mt-2">
          Based on {summary.total_reviews} review
          {summary.total_reviews !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = summary.rating_distribution[rating] || 0
          const percentage = summary.total_reviews > 0
            ? (count / summary.total_reviews) * 100
            : 0

          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-ui-fg-muted w-12">{rating} star</span>
              <div className="flex-1 h-2 bg-ui-bg-base rounded-full overflow-hidden">
                <div
                  className="h-full bg-ds-warning rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-ui-fg-muted w-8 text-right">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
