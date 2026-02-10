import { t, formatCurrency, formatDate, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

interface RefundEvent {
  id: string
  status: string
  timestamp: string
  description?: string
}

interface RefundStatusProps {
  amount: number
  currency: string
  status: "pending" | "processing" | "completed" | "failed"
  method: string
  events: RefundEvent[]
  locale: string
  className?: string
}

const statusConfig: Record<
  string,
  { i18nKey: string; colorClass: string; bgClass: string }
> = {
  pending: {
    i18nKey: "delivery.refund_pending",
    colorClass: "text-ds-warning",
    bgClass: "bg-ds-warning/10",
  },
  processing: {
    i18nKey: "delivery.refund_processing",
    colorClass: "text-ds-info",
    bgClass: "bg-ds-info/10",
  },
  completed: {
    i18nKey: "delivery.refund_completed",
    colorClass: "text-ds-success",
    bgClass: "bg-ds-success/10",
  },
  failed: {
    i18nKey: "delivery.refund_failed",
    colorClass: "text-ds-destructive",
    bgClass: "bg-ds-destructive/10",
  },
}

export function RefundStatus({
  amount,
  currency,
  status,
  method,
  events,
  locale,
  className,
}: RefundStatusProps) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <div className={clsx("bg-ds-background rounded-xl border border-ds-border overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">
          {t(locale, "delivery.refund_status")}
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-xs text-ds-muted-foreground uppercase tracking-wider">
              {t(locale, "delivery.refund_amount")}
            </p>
            <p className="text-xl font-bold text-ds-foreground mt-1">
              {formatCurrency(amount, currency, locale as SupportedLocale)}
            </p>
          </div>

          <div>
            <p className="text-xs text-ds-muted-foreground uppercase tracking-wider">
              {t(locale, "delivery.refund_status")}
            </p>
            <span
              className={clsx(
                "inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full",
                config.bgClass,
                config.colorClass
              )}
            >
              {t(locale, config.i18nKey)}
            </span>
          </div>

          <div>
            <p className="text-xs text-ds-muted-foreground uppercase tracking-wider">
              {t(locale, "delivery.refund_method")}
            </p>
            <p className="text-sm font-medium text-ds-foreground mt-1">{method}</p>
          </div>
        </div>

        {events.length > 0 && (
          <div className="border-t border-ds-border pt-4">
            <div className="space-y-3">
              {events.map((event, index) => {
                const isLast = index === events.length - 1

                return (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={clsx(
                          "w-3 h-3 rounded-full flex-shrink-0 z-10",
                          index === 0 ? "bg-ds-info" : "bg-ds-muted"
                        )}
                      />
                      {!isLast && <div className="w-0.5 flex-1 bg-ds-border" />}
                    </div>
                    <div className={clsx("flex-1", !isLast && "pb-3")}>
                      <p className="text-sm font-medium text-ds-foreground">{event.status}</p>
                      {event.description && (
                        <p className="text-sm text-ds-muted-foreground">{event.description}</p>
                      )}
                      <p className="text-xs text-ds-muted-foreground mt-0.5">
                        {formatDate(event.timestamp, locale as SupportedLocale)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
