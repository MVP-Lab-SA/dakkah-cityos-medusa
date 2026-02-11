import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface DeliveryScheduleSummaryProps {
  date: string
  timeWindow: string
  deliveryType: string
  price?: { amount: number; currency: string }
  address?: string
  onEdit?: () => void
  locale?: string
  className?: string
}

export function DeliveryScheduleSummary({
  date,
  timeWindow,
  deliveryType,
  price,
  address,
  onEdit,
  locale: localeProp,
  className,
}: DeliveryScheduleSummaryProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className={clsx("bg-ds-card border border-ds-border rounded-lg p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">📦</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-ds-foreground text-sm">
              {t(locale, "deliverySlots.delivery_summary")}
            </h4>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-ds-foreground">
                <span className="text-ds-muted-foreground">{t(locale, "deliverySlots.type")}:</span>{" "}
                {deliveryType}
              </p>
              <p className="text-sm text-ds-foreground">
                <span className="text-ds-muted-foreground">{t(locale, "deliverySlots.date")}:</span>{" "}
                {date}
              </p>
              <p className="text-sm text-ds-foreground">
                <span className="text-ds-muted-foreground">{t(locale, "deliverySlots.time")}:</span>{" "}
                {timeWindow}
              </p>
              {address && (
                <p className="text-sm text-ds-foreground">
                  <span className="text-ds-muted-foreground">{t(locale, "deliverySlots.address")}:</span>{" "}
                  {address}
                </p>
              )}
              {price && (
                <p className="text-sm text-ds-foreground">
                  <span className="text-ds-muted-foreground">{t(locale, "deliverySlots.cost")}:</span>{" "}
                  {price.amount === 0
                    ? t(locale, "delivery.free")
                    : formatCurrency(price.amount, price.currency, locale as SupportedLocale)}
                </p>
              )}
            </div>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-ds-primary hover:underline flex-shrink-0"
          >
            {t(locale, "common.edit")}
          </button>
        )}
      </div>
    </div>
  )
}
