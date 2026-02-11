import { useState } from "react"
import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface InstallmentCalculatorProps {
  total: number
  currency?: string
  availablePlans: number[]
  interestRates?: Record<number, number>
  onPlanSelect?: (installments: number) => void
  locale?: string
}

export function InstallmentCalculator({
  total,
  currency = "USD",
  availablePlans,
  interestRates = {},
  onPlanSelect,
  locale: localeProp,
}: InstallmentCalculatorProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const loc = locale as SupportedLocale
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelect = (plan: number) => {
    setSelected(plan)
    onPlanSelect?.(plan)
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border p-5 space-y-4">
      <h4 className="text-sm font-semibold text-ds-foreground">{t(locale, "installments.calculator")}</h4>
      <p className="text-xs text-ds-muted-foreground">
        {t(locale, "installments.total")}: {formatCurrency(total, currency, loc)}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availablePlans.map((plan) => {
          const rate = interestRates[plan] || 0
          const totalWithInterest = total * (1 + rate / 100)
          const monthly = totalWithInterest / plan
          const isSelected = selected === plan

          return (
            <button
              key={plan}
              onClick={() => handleSelect(plan)}
              className={clsx(
                "text-center p-3 rounded-xl border-2 transition-all",
                isSelected
                  ? "border-ds-primary bg-ds-primary/5"
                  : "border-ds-border bg-ds-background hover:border-ds-primary/50"
              )}
            >
              <p className="text-2xl font-bold text-ds-foreground">{plan}</p>
              <p className="text-xs text-ds-muted-foreground mb-2">{t(locale, "installments.months")}</p>
              <p className="text-sm font-semibold text-ds-foreground">
                {formatCurrency(monthly, currency, loc)}
              </p>
              <p className="text-xs text-ds-muted-foreground">{t(locale, "installments.per_month")}</p>
              {rate === 0 && (
                <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 bg-ds-success/10 text-ds-success rounded-full">
                  {t(locale, "installments.no_interest")}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="bg-ds-muted rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ds-muted-foreground">{t(locale, "installments.monthly_payment")}</span>
            <span className="font-semibold text-ds-foreground">
              {formatCurrency(total * (1 + (interestRates[selected] || 0) / 100) / selected, currency, loc)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ds-muted-foreground">{t(locale, "installments.total_cost")}</span>
            <span className="font-semibold text-ds-foreground">
              {formatCurrency(total * (1 + (interestRates[selected] || 0) / 100), currency, loc)}
            </span>
          </div>
          {(interestRates[selected] || 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-ds-muted-foreground">{t(locale, "installments.interest_rate")}</span>
              <span className="text-ds-foreground">{interestRates[selected]}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
