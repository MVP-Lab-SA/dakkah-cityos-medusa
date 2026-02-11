import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface DeliveryETAProps {
  estimatedTime: string
  status: "on-time" | "delayed" | "early" | "delivered"
  updatedAt?: string
  locale?: string
  className?: string
}

const etaConfig: Record<string, { icon: string; colorClass: string; bgClass: string; i18nKey: string }> = {
  "on-time": {
    icon: "🕐",
    colorClass: "text-ds-success",
    bgClass: "bg-ds-success/10 border-ds-success/20",
    i18nKey: "tracking.on_time",
  },
  delayed: {
    icon: "⚠️",
    colorClass: "text-ds-warning",
    bgClass: "bg-ds-warning/10 border-ds-warning/20",
    i18nKey: "tracking.delayed",
  },
  early: {
    icon: "⏩",
    colorClass: "text-ds-info",
    bgClass: "bg-ds-info/10 border-ds-info/20",
    i18nKey: "tracking.early",
  },
  delivered: {
    icon: "✅",
    colorClass: "text-ds-success",
    bgClass: "bg-ds-success/10 border-ds-success/20",
    i18nKey: "tracking.delivered",
  },
}

export function DeliveryETA({
  estimatedTime,
  status,
  updatedAt,
  locale: localeProp,
  className,
}: DeliveryETAProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const config = etaConfig[status] || etaConfig["on-time"]

  return (
    <div className={clsx("rounded-lg border p-4", config.bgClass, className)}>
      <div className="flex items-center gap-3">
        <span className="text-2xl flex-shrink-0">{config.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={clsx("text-sm font-medium", config.colorClass)}>
            {t(locale, config.i18nKey)}
          </p>
          <p className="text-lg font-bold text-ds-foreground mt-0.5">
            {status === "delivered"
              ? t(locale, "tracking.delivered_label")
              : estimatedTime}
          </p>
          {updatedAt && (
            <p className="text-xs text-ds-muted-foreground mt-1">
              {t(locale, "tracking.last_updated")} {updatedAt}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
