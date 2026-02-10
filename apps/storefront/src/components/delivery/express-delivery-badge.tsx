import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

interface ExpressDeliveryBadgeProps {
  type: "same-day" | "express" | "next-day" | "scheduled"
  estimatedTime?: string
  surcharge?: { amount: number; currency: string }
  size?: "sm" | "md" | "lg"
  locale: string
  className?: string
}

const typeConfig: Record<
  string,
  { i18nKey: string; colorClass: string; icon: string }
> = {
  "same-day": {
    i18nKey: "delivery.same_day",
    colorClass: "bg-ds-destructive/10 text-ds-destructive border-ds-destructive/20",
    icon: "⚡",
  },
  express: {
    i18nKey: "delivery.express",
    colorClass: "bg-ds-warning/10 text-ds-warning border-ds-warning/20",
    icon: "🚀",
  },
  "next-day": {
    i18nKey: "delivery.next_day",
    colorClass: "bg-ds-info/10 text-ds-info border-ds-info/20",
    icon: "📦",
  },
  scheduled: {
    i18nKey: "delivery.scheduled",
    colorClass: "bg-ds-muted text-ds-muted-foreground border-ds-border",
    icon: "📅",
  },
}

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-3 py-1 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
}

export function ExpressDeliveryBadge({
  type,
  estimatedTime,
  surcharge,
  size = "md",
  locale,
  className,
}: ExpressDeliveryBadgeProps) {
  const config = typeConfig[type] || typeConfig.scheduled

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border font-medium",
        config.colorClass,
        sizeClasses[size],
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{t(locale, config.i18nKey)}</span>
      {estimatedTime && (
        <span className="opacity-75">· {estimatedTime}</span>
      )}
      {surcharge && surcharge.amount > 0 && (
        <span className="opacity-75">
          +{formatCurrency(surcharge.amount, surcharge.currency, locale as SupportedLocale)}
        </span>
      )}
    </span>
  )
}
