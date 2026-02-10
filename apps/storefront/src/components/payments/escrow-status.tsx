import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

interface EscrowStatusProps {
  escrowId: string
  amount: number
  currency?: string
  status: "held" | "released" | "disputed" | "refunded"
  heldSince?: string
  releaseDate?: string
  parties: { buyer: string; seller: string }
  locale: string
}

const statusConfig: Record<string, { color: string; icon: string }> = {
  held: { color: "bg-ds-warning/10 text-ds-warning", icon: "🔒" },
  released: { color: "bg-ds-success/10 text-ds-success", icon: "✓" },
  disputed: { color: "bg-ds-destructive/10 text-ds-destructive", icon: "⚠" },
  refunded: { color: "bg-ds-accent/10 text-ds-accent", icon: "↩" },
}

export function EscrowStatus({
  escrowId,
  amount,
  currency = "USD",
  status,
  heldSince,
  releaseDate,
  parties,
  locale,
}: EscrowStatusProps) {
  const loc = locale as SupportedLocale
  const config = statusConfig[status] || statusConfig.held

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-ds-muted-foreground">{t(locale, "payment.escrow")}</p>
            <p className="text-2xl font-bold text-ds-foreground mt-1">
              {formatCurrency(amount, currency, loc)}
            </p>
          </div>
          <span className={clsx("inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full", config.color)}>
            <span>{config.icon}</span>
            {t(locale, `payment.${status}`)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {heldSince && (
            <div className="bg-ds-muted rounded-lg p-3">
              <p className="text-xs text-ds-muted-foreground mb-1">{t(locale, "payment.held_since")}</p>
              <p className="text-sm font-medium text-ds-foreground">
                {new Date(heldSince).toLocaleDateString()}
              </p>
            </div>
          )}
          {releaseDate && (
            <div className="bg-ds-muted rounded-lg p-3">
              <p className="text-xs text-ds-muted-foreground mb-1">{t(locale, "payment.release_date")}</p>
              <p className="text-sm font-medium text-ds-foreground">
                {new Date(releaseDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-ds-border bg-ds-muted/30 px-6 py-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-ds-muted-foreground mb-0.5">{t(locale, "payment.buyer")}</p>
            <p className="font-medium text-ds-foreground">{parties.buyer}</p>
          </div>
          <div>
            <p className="text-xs text-ds-muted-foreground mb-0.5">{t(locale, "payment.seller")}</p>
            <p className="font-medium text-ds-foreground">{parties.seller}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
