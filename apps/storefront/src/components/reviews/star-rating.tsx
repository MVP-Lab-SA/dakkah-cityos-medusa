import { Star, StarSolid } from "@medusajs/icons"
import { clsx as clx } from "clsx"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <div className={clx("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating)
        const partial = i === Math.floor(rating) && rating % 1 > 0

        return (
          <span key={i} className="relative">
            {filled ? (
              <StarSolid className={clx(sizeClasses[size], "text-ds-warning")} />
            ) : partial ? (
              <div className="relative">
                <Star className={clx(sizeClasses[size], "text-ui-fg-muted")} />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <StarSolid className={clx(sizeClasses[size], "text-ds-warning")} />
                </div>
              </div>
            ) : (
              <Star className={clx(sizeClasses[size], "text-ui-fg-muted")} />
            )}
          </span>
        )
      })}
      {showValue && (
        <span className="ms-1 text-sm text-ui-fg-muted">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  maxRating?: number
  size?: "sm" | "md" | "lg"
}

export function StarRatingInput({
  value,
  onChange,
  maxRating = 5,
  size = "lg",
}: StarRatingInputProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1
        const filled = starValue <= value

        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starValue)}
            className="focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
          >
            {filled ? (
              <StarSolid className={clx(sizeClasses[size], "text-ds-warning")} />
            ) : (
              <Star className={clx(sizeClasses[size], "text-ui-fg-muted hover:text-ds-warning transition-colors")} />
            )}
          </button>
        )
      })}
    </div>
  )
}
