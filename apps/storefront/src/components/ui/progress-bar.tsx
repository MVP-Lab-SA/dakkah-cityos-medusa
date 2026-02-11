import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface ProgressBarProps {
  locale?: string
  className?: string
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "success" | "warning" | "destructive"
  animated?: boolean
}

export function ProgressBar({
  locale: localeProp,
  className = "",
  value,
  max = 100,
  label,
  showPercentage = false,
  size = "md",
  variant = "primary",
  animated = false,
}: ProgressBarProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const sizeClasses = { sm: "h-1", md: "h-2", lg: "h-3" }
  const variantClasses = {
    primary: "bg-ds-primary",
    success: "bg-ds-success",
    warning: "bg-ds-warning",
    destructive: "bg-ds-destructive",
  }

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-ds-text">{label}</span>}
          {showPercentage && (
            <span className="text-xs text-ds-muted tabular-nums">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-ds-accent rounded-full overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || t(locale, "ui.progress")}
      >
        <div
          className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full transition-all duration-500 ease-out ${
            animated ? "animate-pulse" : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
