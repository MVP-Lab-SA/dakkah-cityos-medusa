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

interface BNPLProviderCardProps {
  provider: BNPLProvider
  selected?: boolean
  onSelect?: (providerId: string) => void
  currency?: string
  locale?: string
}

export function BNPLProviderCard({
  provider,
  selected = false,
  onSelect,
  currency = "USD",
  locale: localeProp,
}: BNPLProviderCardProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const loc = locale as SupportedLocale
  const cur = provider.currency || currency

  return (
    <button
      onClick={() => provider.eligible && onSelect?.(provider.id)}
      disabled={!provider.eligible}
      className={clsx(
        "w-full text-start p-4 rounded-xl border-2 transition-all",
        selected
          ? "border-ds-primary bg-ds-primary/5 shadow-sm"
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
            <div className="h-8 w-8 rounded-lg bg-ds-accent/10 flex items-center justify-center text-sm font-bold text-ds-accent">
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

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-ds-muted-foreground">{t(locale, "bnpl.installments")}</p>
          <p className="font-semibold text-ds-foreground">{provider.installments}x</p>
        </div>
        <div>
          <p className="text-xs text-ds-muted-foreground">{t(locale, "bnpl.monthly_payment")}</p>
          <p className="font-semibold text-ds-foreground">{formatCurrency(provider.monthlyPayment, cur, loc)}</p>
        </div>
        <div>
          <p className="text-xs text-ds-muted-foreground">{t(locale, "bnpl.interest_rate")}</p>
          <p className="font-semibold text-ds-foreground">
            {provider.interestRate === 0 ? t(locale, "bnpl.no_interest") : `${provider.interestRate}%`}
          </p>
        </div>
      </div>
    </button>
  )
}
