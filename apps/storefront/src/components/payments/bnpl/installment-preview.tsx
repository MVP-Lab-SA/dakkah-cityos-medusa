import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface InstallmentPreviewProps {
  installments: number
  monthlyAmount: number
  totalAmount: number
  interestRate: number
  currency?: string
  startDate?: string
  locale?: string
}

export function InstallmentPreview({
  installments,
  monthlyAmount,
  totalAmount,
  interestRate,
  currency = "USD",
  startDate,
  locale: localeProp,
}: InstallmentPreviewProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const loc = locale as SupportedLocale

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border p-5 space-y-4">
      <h4 className="text-sm font-semibold text-ds-foreground">{t(locale, "bnpl.payment_preview")}</h4>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-ds-muted rounded-lg p-3">
          <p className="text-xs text-ds-muted-foreground mb-1">{t(locale, "bnpl.installments")}</p>
          <p className="text-lg font-bold text-ds-foreground">{installments}x</p>
        </div>
        <div className="bg-ds-muted rounded-lg p-3">
          <p className="text-xs text-ds-muted-foreground mb-1">{t(locale, "bnpl.monthly_payment")}</p>
          <p className="text-lg font-bold text-ds-foreground">
            {formatCurrency(monthlyAmount, currency, loc)}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-ds-muted-foreground">{t(locale, "bnpl.total_cost")}</span>
          <span className="font-semibold text-ds-foreground">
            {formatCurrency(totalAmount, currency, loc)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-ds-muted-foreground">{t(locale, "bnpl.interest_rate")}</span>
          <span className="text-ds-foreground">
            {interestRate === 0 ? t(locale, "bnpl.no_interest") : `${interestRate}%`}
          </span>
        </div>
        {startDate && (
          <div className="flex justify-between">
            <span className="text-ds-muted-foreground">{t(locale, "bnpl.first_payment")}</span>
            <span className="text-ds-foreground">{new Date(startDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
