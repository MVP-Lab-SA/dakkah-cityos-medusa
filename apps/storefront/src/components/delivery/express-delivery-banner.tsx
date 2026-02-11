import { useState } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface ExpressDeliveryBannerProps {
  title?: string
  description?: string
  cutoffTime?: string
  deliveryType: "same-day" | "express" | "next-day"
  zipCode?: string
  onCheckAvailability?: (zipCode: string) => void
  available?: boolean
  locale?: string
  className?: string
}

const typeIcons: Record<string, string> = {
  "same-day": "⚡",
  express: "🚀",
  "next-day": "📦",
}

export function ExpressDeliveryBanner({
  title,
  description,
  cutoffTime,
  deliveryType,
  zipCode: initialZip,
  onCheckAvailability,
  available,
  locale: localeProp,
  className,
}: ExpressDeliveryBannerProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [zipCode, setZipCode] = useState(initialZip || "")

  const typeKey = deliveryType === "same-day" ? "same_day" : deliveryType === "next-day" ? "next_day" : "express"

  return (
    <div
      className={clsx(
        "bg-ds-primary/5 border border-ds-primary/20 rounded-xl p-4 md:p-6",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl flex-shrink-0">{typeIcons[deliveryType]}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-ds-foreground">
            {title || t(locale, `expressDelivery.${typeKey}_title`)}
          </h3>
          <p className="text-sm text-ds-muted-foreground mt-1">
            {description || t(locale, `expressDelivery.${typeKey}_desc`)}
          </p>

          {cutoffTime && (
            <p className="text-sm text-ds-primary font-medium mt-2">
              {t(locale, "expressDelivery.order_before").replace("{time}", cutoffTime)}
            </p>
          )}

          {onCheckAvailability && (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder={t(locale, "expressDelivery.enter_zip")}
                className="px-3 py-2 text-sm rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary w-40"
              />
              <button
                onClick={() => onCheckAvailability(zipCode)}
                disabled={!zipCode}
                className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {t(locale, "expressDelivery.check_availability")}
              </button>
            </div>
          )}

          {available !== undefined && (
            <div className={clsx(
              "mt-3 text-sm font-medium flex items-center gap-1.5",
              available ? "text-ds-success" : "text-ds-destructive"
            )}>
              <span>{available ? "✓" : "✗"}</span>
              <span>
                {available
                  ? t(locale, "expressDelivery.available_in_area")
                  : t(locale, "expressDelivery.not_available_in_area")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
