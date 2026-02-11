import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface PriorityFulfillmentProps {
  priority: "standard" | "high" | "urgent"
  estimatedTime?: string
  description?: string
  locale?: string
  className?: string
}

const priorityConfig: Record<string, { icon: string; colorClass: string; i18nKey: string }> = {
  standard: {
    icon: "📦",
    colorClass: "bg-ds-muted text-ds-muted-foreground border-ds-border",
    i18nKey: "delivery.standard",
  },
  high: {
    icon: "🔥",
    colorClass: "bg-ds-warning/10 text-ds-warning border-ds-warning/20",
    i18nKey: "expressDelivery.express_title",
  },
  urgent: {
    icon: "⚡",
    colorClass: "bg-ds-destructive/10 text-ds-destructive border-ds-destructive/20",
    i18nKey: "expressDelivery.same_day_title",
  },
}

export function PriorityFulfillment({
  priority,
  estimatedTime,
  description,
  locale: localeProp,
  className,
}: PriorityFulfillmentProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const config = priorityConfig[priority] || priorityConfig.standard

  return (
    <div className={clsx("inline-flex items-center gap-2 px-3 py-2 rounded-lg border", config.colorClass, className)}>
      <span>{config.icon}</span>
      <div>
        <p className="text-sm font-medium">{t(locale, config.i18nKey)}</p>
        {estimatedTime && (
          <p className="text-xs opacity-75">{estimatedTime}</p>
        )}
        {description && (
          <p className="text-xs opacity-75">{description}</p>
        )}
      </div>
    </div>
  )
}
