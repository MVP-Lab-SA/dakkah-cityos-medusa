import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface BNPLBadgeProps {
  providerName: string
  installments: number
  monthlyAmount: number
  currency?: string
  locale?: string
}

export function BNPLBadge({
  providerName,
  installments,
  monthlyAmount,
  currency = "USD",
  locale: localeProp,
}: BNPLBadgeProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const loc = locale as SupportedLocale

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ds-accent/10 rounded-full">
      <span className="text-xs font-semibold text-ds-accent">{providerName}</span>
      <span className="text-xs text-ds-muted-foreground">
        {installments}x {formatCurrency(monthlyAmount, currency, loc)}
      </span>
    </div>
  )
}
