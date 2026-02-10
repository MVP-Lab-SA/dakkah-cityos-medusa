import { t, formatCurrency, formatDate, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

interface InstallmentPlan {
  id: string
  installments: number
  monthlyAmount: number
  totalAmount: number
  currency: string
  interestRate: number
  processingFee?: number
  firstPaymentDate?: string
}

interface InstallmentPickerProps {
  total: number
  currency?: string
  plans: InstallmentPlan[]
  selectedPlanId?: string
  onPlanSelect: (planId: string) => void
  locale: string
  loading?: boolean
}

export function InstallmentPicker({
  total,
  currency = "USD",
  plans,
  selectedPlanId,
  onPlanSelect,
  locale,
  loading = false,
}: InstallmentPickerProps) {
  const loc = locale as SupportedLocale

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-ds-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ds-foreground">{t(locale, "payment.select_plan")}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id
          const savings = plan.totalAmount - total

          return (
            <button
              key={plan.id}
              onClick={() => onPlanSelect(plan.id)}
              className={clsx(
                "text-start p-4 rounded-xl border-2 transition-all relative",
                isSelected
                  ? "border-ds-primary bg-ds-primary/5 shadow-sm"
                  : "border-ds-border bg-ds-background hover:border-ds-primary/50"
              )}
            >
              {plan.interestRate === 0 && (
                <div className="absolute -top-2.5 start-3 px-2 py-0.5 bg-ds-success text-white text-xs font-semibold rounded-full">
                  {t(locale, "payment.no_interest")}
                </div>
              )}

              <div className="text-center mb-3">
                <p className="text-3xl font-bold text-ds-foreground">{plan.installments}</p>
                <p className="text-sm text-ds-muted-foreground">{t(locale, "payment.months")}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ds-muted-foreground">{t(locale, "payment.monthly_payment")}</span>
                  <span className="font-semibold text-ds-foreground">
                    {formatCurrency(plan.monthlyAmount, plan.currency || currency, loc)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ds-muted-foreground">{t(locale, "payment.total_cost")}</span>
                  <span className="font-medium text-ds-foreground">
                    {formatCurrency(plan.totalAmount, plan.currency || currency, loc)}
                  </span>
                </div>
                {plan.interestRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ds-muted-foreground">{t(locale, "payment.interest_rate")}</span>
                    <span className="text-ds-foreground">{plan.interestRate}%</span>
                  </div>
                )}
                {plan.processingFee !== undefined && plan.processingFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ds-muted-foreground">{t(locale, "payment.processing_fee")}</span>
                    <span className="text-ds-foreground">
                      {formatCurrency(plan.processingFee, plan.currency || currency, loc)}
                    </span>
                  </div>
                )}
                {plan.firstPaymentDate && (
                  <div className="flex justify-between">
                    <span className="text-ds-muted-foreground">{t(locale, "payment.first_payment")}</span>
                    <span className="text-ds-foreground">{formatDate(plan.firstPaymentDate, loc)}</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
