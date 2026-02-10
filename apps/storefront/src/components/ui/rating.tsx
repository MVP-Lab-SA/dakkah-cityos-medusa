import React from "react"

interface RatingProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  count?: number
  interactive?: boolean
  onChange?: (value: number) => void
  className?: string
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = "md",
  showValue,
  count,
  interactive,
  onChange,
  className = "",
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  const displayValue = hoverValue ?? value

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1
          const filled = starValue <= displayValue
          const halfFilled = starValue - 0.5 <= displayValue && starValue > displayValue

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverValue(starValue)}
              onMouseLeave={() => interactive && setHoverValue(null)}
              className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-colors`}
            >
              <svg
                className={`${sizeMap[size]} ${filled ? "text-ds-warning" : halfFilled ? "text-ds-warning" : "text-ds-muted"}`}
                fill={filled || halfFilled ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={filled || halfFilled ? 0 : 1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-ds-foreground">{value.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-sm text-ds-muted-foreground">({count})</span>
      )}
    </div>
  )
}
