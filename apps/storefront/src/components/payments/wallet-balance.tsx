import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

interface WalletBalanceProps {
  balance: number
  pendingBalance?: number
  currency?: string
  lastUpdated?: string
  locale: string
  size?: "compact" | "detailed"
  showTopUp?: boolean
  onTopUp?: () => void
  loading?: boolean
}

export function WalletBalance({
  balance,
  pendingBalance,
  currency = "USD",
  lastUpdated,
  locale,
  size = "detailed",
  showTopUp = true,
  onTopUp,
  loading = false,
}: WalletBalanceProps) {
  const loc = locale as SupportedLocale

  if (loading) {
    return (
      <div className={clsx(
        "bg-ds-background rounded-xl border border-ds-border",
        size === "compact" ? "p-4" : "p-6"
      )}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 bg-ds-muted rounded" />
          <div className="h-8 w-40 bg-ds-muted rounded" />
          <div className="h-3 w-32 bg-ds-muted rounded" />
        </div>
      </div>
    )
  }

  if (size === "compact") {
    return (
      <div className="bg-ds-background rounded-lg border border-ds-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ds-muted-foreground">{t(locale, "payment.available_balance")}</p>
            <p className="text-xl font-bold text-ds-foreground mt-1">
              {formatCurrency(balance, currency, loc)}
            </p>
          </div>
          {showTopUp && onTopUp && (
            <button
              onClick={onTopUp}
              className="px-3 py-1.5 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t(locale, "payment.top_up")}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-ds-foreground">{t(locale, "payment.wallet")}</h3>
        {showTopUp && onTopUp && (
          <button
            onClick={onTopUp}
            className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            {t(locale, "payment.top_up_wallet")}
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-ds-muted-foreground">{t(locale, "payment.available_balance")}</p>
          <p className="text-3xl font-bold text-ds-foreground mt-1">
            {formatCurrency(balance, currency, loc)}
          </p>
        </div>

        {pendingBalance !== undefined && pendingBalance > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-ds-muted rounded-lg">
            <div className="w-2 h-2 rounded-full bg-ds-warning flex-shrink-0" />
            <span className="text-sm text-ds-muted-foreground">
              {t(locale, "payment.pending_balance")}:
            </span>
            <span className="text-sm font-medium text-ds-foreground">
              {formatCurrency(pendingBalance, currency, loc)}
            </span>
          </div>
        )}

        {lastUpdated && (
          <p className="text-xs text-ds-muted-foreground">
            {t(locale, "payment.last_updated")}: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}
