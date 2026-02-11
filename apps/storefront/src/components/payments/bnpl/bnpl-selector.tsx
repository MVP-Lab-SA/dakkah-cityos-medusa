import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface BNPLProvider {
  id: string
  name: string
  logo?: string
  installments: number
  interestRate: number
  monthlyPayment: number
  totalPayment: number
  currency: string
  eligible: boolean
  minAmount?: number
  maxAmount?: number
}

interface BNPLSelectorProps {
  providers: BNPLProvider[]
  orderTotal: number
  currency?: string
  selectedProviderId?: string
  onProviderSelect: (providerId: string) => void
  onEligibilityCheck?: () => void
  locale?: string
  loading?: boolean
}

export function BNPLSelector({
  providers,
  orderTotal,
  currency = "USD",
  selectedProviderId,
  onProviderSelect,
  onEligibilityCheck,
  locale: localeProp,
  loading = false,
}: BNPLSelectorProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const loc = locale as SupportedLocale

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-ds-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!providers.length) {
    return (
      <div className="bg-ds-background rounded-lg border border-ds-border p-8 text-center">
        <p className="text-ds-muted-foreground">{t(locale, "bnpl.no_providers")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ds-foreground">{t(locale, "bnpl.title")}</h3>
        {onEligibilityCheck && (
          <button
            onClick={onEligibilityCheck}
            className="text-sm font-medium text-ds-primary hover:underline"
          >
            {t(locale, "bnpl.check_eligibility")}
          </button>
        )}
      </div>
      <p className="text-sm text-ds-muted-foreground">{t(locale, "bnpl.select_provider")}</p>

      <div className="space-y-3">
        {providers.map((provider) => {
          const isSelected = selectedProviderId === provider.id

          return (
            <button
              key={provider.id}
              onClick={() => provider.eligible && onProviderSelect(provider.id)}
              disabled={!provider.eligible}
              className={clsx(
                "w-full text-start p-4 rounded-lg border-2 transition-all",
                isSelected
                  ? "border-ds-primary bg-ds-primary/5"
                  : provider.eligible
                    ? "border-ds-border bg-ds-background hover:border-ds-primary/50"
                    : "border-ds-border bg-ds-muted opacity-60 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {provider.logo ? (
                    <img src={provider.logo} alt={provider.name} className="h-8 w-auto object-contain" />
                  ) : (
                    <div className="h-8 w-8 rounded bg-ds-muted flex items-center justify-center text-xs font-bold text-ds-foreground">
                      {provider.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-semibold text-ds-foreground">{provider.name}</span>
                </div>
                <span className={clsx(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  provider.eligible
                    ? "bg-ds-success/10 text-ds-success"
                    : "bg-ds-destructive/10 text-ds-destructive"
                )}>
                  {provider.eligible ? t(locale, "bnpl.eligible") : t(locale, "bnpl.not_eligible")}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-ds-muted-foreground">{t(locale, "bnpl.installments")}</p>
                  <p className="font-semibold text-ds-foreground">
                    {provider.installments}x {t(locale, "bnpl.months")}
                  </p>
                </div>
                <div>
                  <p className="text-ds-muted-foreground">{t(locale, "bnpl.monthly_payment")}</p>
                  <p className="font-semibold text-ds-foreground">
                    {formatCurrency(provider.monthlyPayment, provider.currency || currency, loc)}
                  </p>
                </div>
                <div>
                  <p className="text-ds-muted-foreground">{t(locale, "bnpl.interest_rate")}</p>
                  <p className="font-semibold text-ds-foreground">
                    {provider.interestRate === 0 ? t(locale, "bnpl.no_interest") : `${provider.interestRate}%`}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-ds-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-ds-muted-foreground">{t(locale, "bnpl.total_cost")}</span>
                    <span className="font-semibold text-ds-foreground">
                      {formatCurrency(provider.totalPayment, provider.currency || currency, loc)}
                    </span>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
