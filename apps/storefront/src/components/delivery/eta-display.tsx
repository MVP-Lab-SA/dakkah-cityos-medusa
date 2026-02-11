import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface ETADisplayProps {
  estimatedTime: string
  status: "on-time" | "delayed" | "early" | "delivered"
  countdown?: boolean
  updatedAt?: string
  locale?: string
  className?: string
}

const statusConfig: Record<string, { icon: string; colorClass: string; i18nKey: string }> = {
  "on-time": {
    icon: "🟢",
    colorClass: "bg-ds-success/10 text-ds-success border-ds-success/20",
    i18nKey: "tracking.on_time",
  },
  delayed: {
    icon: "🟡",
    colorClass: "bg-ds-warning/10 text-ds-warning border-ds-warning/20",
    i18nKey: "tracking.delayed",
  },
  early: {
    icon: "🔵",
    colorClass: "bg-ds-accent text-ds-foreground border-ds-border",
    i18nKey: "tracking.early",
  },
  delivered: {
    icon: "✅",
    colorClass: "bg-ds-success/10 text-ds-success border-ds-success/20",
    i18nKey: "tracking.delivered_label",
  },
}

export function ETADisplay({
  estimatedTime,
  status,
  updatedAt,
  locale: localeProp,
  className,
}: ETADisplayProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const config = statusConfig[status] || statusConfig["on-time"]

  return (
    <div className={clsx("flex items-center gap-3 p-4 rounded-xl border", config.colorClass, className)}>
      <span className="text-xl">{config.icon}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{t(locale, "tracking.eta")}: {estimatedTime}</p>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-current/10">
            {t(locale, config.i18nKey)}
          </span>
        </div>
        {updatedAt && (
          <p className="text-xs opacity-75 mt-0.5">{t(locale, "tracking.last_updated")}: {updatedAt}</p>
        )}
      </div>
    </div>
  )
}
