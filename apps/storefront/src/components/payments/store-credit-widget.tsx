import { useState } from "react"
import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

interface StoreCreditWidgetProps {
  balance: number
  currency?: string
  appliedAmount?: number
  maxApplicable?: number
  onApply?: (amount: number) => void
  onRemove?: () => void
  locale: string
  loading?: boolean
}

export function StoreCreditWidget({
  balance,
  currency = "USD",
  appliedAmount,
  maxApplicable,
  onApply,
  onRemove,
  locale,
  loading = false,
}: StoreCreditWidgetProps) {
  const loc = locale as SupportedLocale
  const [inputAmount, setInputAmount] = useState("")
  const isApplied = appliedAmount !== undefined && appliedAmount > 0
  const maxAmount = maxApplicable !== undefined ? Math.min(balance, maxApplicable) : balance

  if (loading) {
    return (
      <div className="bg-ds-background rounded-lg border border-ds-border p-4 animate-pulse">
        <div className="h-4 w-24 bg-ds-muted rounded mb-2" />
        <div className="h-6 w-32 bg-ds-muted rounded" />
      </div>
    )
  }

  if (balance <= 0) {
    return null
  }

  const handleApply = () => {
    const amount = parseFloat(inputAmount)
    if (amount > 0 && amount <= maxAmount && onApply) {
      onApply(amount)
      setInputAmount("")
    }
  }

  return (
    <div className="bg-ds-background rounded-lg border border-ds-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-ds-foreground">{t(locale, "payment.store_credit")}</h4>
        <span className="text-sm text-ds-muted-foreground">
          {t(locale, "payment.balance")}: {formatCurrency(balance, currency, loc)}
        </span>
      </div>

      {isApplied ? (
        <div className="flex items-center justify-between bg-ds-success/10 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ds-success">{t(locale, "payment.credit_applied")}</p>
            <p className="text-lg font-bold text-ds-success">
              -{formatCurrency(appliedAmount, currency, loc)}
            </p>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="px-3 py-1.5 text-sm font-medium text-ds-destructive bg-ds-background border border-ds-border rounded-lg hover:bg-ds-muted transition-colors"
            >
              {t(locale, "payment.remove")}
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              min="0.01"
              max={maxAmount}
              step="0.01"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder={t(locale, "payment.amount_to_apply")}
              className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
            />
          </div>
          <button
            onClick={() => { setInputAmount(String(maxAmount)); }}
            className="px-3 py-2 text-xs font-medium text-ds-muted-foreground border border-ds-border rounded-lg hover:bg-ds-muted transition-colors"
          >
            Max
          </button>
          <button
            onClick={handleApply}
            disabled={!inputAmount || parseFloat(inputAmount) <= 0 || parseFloat(inputAmount) > maxAmount}
            className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t(locale, "payment.apply")}
          </button>
        </div>
      )}
    </div>
  )
}
