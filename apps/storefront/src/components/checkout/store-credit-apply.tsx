// @ts-nocheck
import { useState } from "react"
import { t, formatCurrency } from "../../lib/i18n"
import type { SupportedLocale } from "../../lib/i18n"

interface StoreCreditApplyProps {
  availableCredits: number
  currency: string
  cartTotal: number
  locale: string
  onApply?: (amount: number) => void
  onRemove?: () => void
}

function StoreCreditApply({
  availableCredits,
  currency,
  cartTotal,
  locale,
  onApply,
  onRemove,
}: StoreCreditApplyProps) {
  const [applied, setApplied] = useState(false)
  const [amount, setAmount] = useState(Math.min(availableCredits, cartTotal))

  const maxApplicable = Math.min(availableCredits, cartTotal)
  const remainingTotal = applied ? Math.max(0, cartTotal - amount) : cartTotal
  const loc = (locale || "en") as SupportedLocale

  const handleToggle = () => {
    if (applied) {
      setApplied(false)
      onRemove?.()
    } else {
      setApplied(true)
      onApply?.(amount)
    }
  }

  const handleAmountChange = (value: number) => {
    const clamped = Math.min(Math.max(0, value), maxApplicable)
    setAmount(clamped)
    if (applied) {
      onApply?.(clamped)
    }
  }

  if (availableCredits <= 0) return null

  return (
    <div className="bg-ds-card border border-ds-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-ds-success/15 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-ds-foreground">
              {t(locale, "checkout.store_credits")}
            </p>
            <p className="text-xs text-ds-muted-foreground">
              {t(locale, "checkout.available_balance")}: {formatCurrency(availableCredits, currency, loc)}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className={`w-11 h-6 rounded-full transition-colors relative ${
            applied ? "bg-ds-primary" : "bg-ds-border"
          }`}
          role="switch"
          aria-checked={applied}
          aria-label={t(locale, "checkout.apply_credits")}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
              applied ? "start-6" : "start-1"
            }`}
          />
        </button>
      </div>

      {applied && (
        <div className="space-y-3 pt-2 border-t border-ds-border">
          <div>
            <label className="text-xs font-medium text-ds-muted-foreground mb-1.5 block">
              {t(locale, "checkout.credit_amount")}
            </label>
            <input
              type="range"
              min={0}
              max={maxApplicable}
              step={0.01}
              value={amount}
              onChange={(e) => handleAmountChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-ds-border rounded-full appearance-none cursor-pointer accent-ds-primary"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-ds-muted-foreground">
                {formatCurrency(0, currency, loc)}
              </span>
              <span className="text-xs text-ds-muted-foreground">
                {formatCurrency(maxApplicable, currency, loc)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={maxApplicable}
              step={0.01}
              value={amount}
              onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
              className="w-28 px-3 py-1.5 text-sm border border-ds-border rounded-lg bg-ds-card text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary/30"
            />
            <span className="text-xs text-ds-muted-foreground uppercase">{currency}</span>
          </div>

          <div className="bg-ds-success/10 rounded-lg p-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-ds-foreground">{t(locale, "checkout.credit_deduction")}</span>
              <span className="font-medium text-ds-success">
                -{formatCurrency(amount, currency, loc)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ds-foreground">{t(locale, "checkout.remaining_total")}</span>
              <span className="font-semibold text-ds-foreground">
                {formatCurrency(remainingTotal, currency, loc)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreCreditApply
