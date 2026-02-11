import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"
import { formatCurrency } from "../../lib/i18n"
import type { SupportedLocale } from "../../lib/i18n"

interface CartSavingsProps {
  locale?: string
  originalTotal: number
  currentTotal: number
  currency?: string
}

export function CartSavings({ locale: localeProp, originalTotal, currentTotal, currency = "USD" }: CartSavingsProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const savings = originalTotal - currentTotal

  if (savings <= 0) return null

  const percentage = Math.round((savings / originalTotal) * 100)

  return (
    <div className="bg-ds-success/10 border border-ds-success/20 rounded-lg p-3 flex items-center gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-ds-success/20 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-ds-success">
          {t(locale, "checkout.you_save")} {formatCurrency(savings, currency, locale as SupportedLocale)}
        </p>
        <p className="text-xs text-ds-success/80">
          {percentage}% {t(locale, "checkout.savings_off")}
        </p>
      </div>
    </div>
  )
}
