import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface RefundTrackerProps {
  refundId: string
  amount: number
  currency?: string
  status: "requested" | "processing" | "completed" | "denied"
  method: "original" | "store-credit" | "wallet"
  requestedAt: string
  completedAt?: string
  timeline?: { status: string; timestamp: string }[]
  locale?: string
}

const statusConfig: Record<string, { color: string; icon: string }> = {
  requested: { color: "bg-ds-warning/10 text-ds-warning", icon: "○" },
  processing: { color: "bg-ds-accent/10 text-ds-accent", icon: "◎" },
  completed: { color: "bg-ds-success/10 text-ds-success", icon: "✓" },
  denied: { color: "bg-ds-destructive/10 text-ds-destructive", icon: "✗" },
}

const methodLabels: Record<string, string> = {
  original: "disputes.method_original",
  "store-credit": "disputes.method_store_credit",
  wallet: "disputes.method_wallet",
}

export function RefundTracker({
  refundId,
  amount,
  currency = "USD",
  status,
  method,
  requestedAt,
  completedAt,
  timeline,
  locale: localeProp,
}: RefundTrackerProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const loc = locale as SupportedLocale
  const config = statusConfig[status] || statusConfig.requested

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ds-muted-foreground">{t(locale, "disputes.refund_tracker")}</p>
          <p className="text-2xl font-bold text-ds-foreground mt-1">
            {formatCurrency(amount, currency, loc)}
          </p>
        </div>
        <span className={clsx("inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full", config.color)}>
          <span>{config.icon}</span>
          {t(locale, `disputes.${status}`)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-ds-muted rounded-lg p-3">
          <p className="text-xs text-ds-muted-foreground mb-1">{t(locale, "disputes.refund_method")}</p>
          <p className="font-medium text-ds-foreground">{t(locale, methodLabels[method])}</p>
        </div>
        <div className="bg-ds-muted rounded-lg p-3">
          <p className="text-xs text-ds-muted-foreground mb-1">{t(locale, "disputes.requested_at")}</p>
          <p className="font-medium text-ds-foreground">{new Date(requestedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {completedAt && (
        <div className="bg-ds-success/10 rounded-lg px-4 py-3">
          <p className="text-sm text-ds-success">
            {t(locale, "disputes.completed_at")}: {new Date(completedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {timeline && timeline.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-ds-muted-foreground uppercase">{t(locale, "disputes.timeline")}</h5>
          <div className="space-y-2">
            {timeline.map((entry, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-ds-primary flex-shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-ds-foreground">{entry.status}</span>
                  <span className="text-xs text-ds-muted-foreground">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
