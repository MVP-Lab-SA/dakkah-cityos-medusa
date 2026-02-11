import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface StoreCreditBalanceProps {
  balance: number
  currency?: string
  expiringAmount?: number
  expiringDate?: string
  locale?: string
  loading?: boolean
}

export function StoreCreditBalance({
  balance,
  currency = "USD",
  expiringAmount,
  expiringDate,
  locale: localeProp,
  loading = false,
}: StoreCreditBalanceProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const loc = locale as SupportedLocale

  if (loading) {
    return (
      <div className="bg-ds-background rounded-xl border border-ds-border p-6 animate-pulse">
        <div className="h-4 w-24 bg-ds-muted rounded mb-3" />
        <div className="h-8 w-40 bg-ds-muted rounded" />
      </div>
    )
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ds-muted-foreground mb-1">{t(locale, "storeCredits.available_balance")}</p>
          <p className="text-3xl font-bold text-ds-foreground">
            {formatCurrency(balance, currency, loc)}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-ds-accent/10 flex items-center justify-center">
          <span className="text-xl text-ds-accent">₵</span>
        </div>
      </div>

      {expiringAmount !== undefined && expiringAmount > 0 && expiringDate && (
        <div className="mt-4 bg-ds-warning/10 rounded-lg px-4 py-3 flex items-center gap-2">
          <span className="text-ds-warning text-sm">⚠</span>
          <p className="text-sm text-ds-warning">
            {formatCurrency(expiringAmount, currency, loc)} {t(locale, "storeCredits.expiring_on")} {new Date(expiringDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}
