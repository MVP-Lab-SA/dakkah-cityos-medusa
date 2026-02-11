import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface BNPLEligibilityProps {
  eligible: boolean
  reason?: string
  minAmount?: number
  maxAmount?: number
  currency?: string
  onCheck?: () => void
  locale?: string
  loading?: boolean
}

export function BNPLEligibility({
  eligible,
  reason,
  minAmount,
  maxAmount,
  currency = "USD",
  onCheck,
  locale: localeProp,
  loading = false,
}: BNPLEligibilityProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const loc = locale as SupportedLocale

  if (loading) {
    return (
      <div className="bg-ds-background rounded-lg border border-ds-border p-4 animate-pulse">
        <div className="h-4 w-40 bg-ds-muted rounded mb-2" />
        <div className="h-3 w-56 bg-ds-muted rounded" />
      </div>
    )
  }

  return (
    <div className={clsx(
      "rounded-lg border p-4",
      eligible
        ? "bg-ds-success/10 border-ds-success/20"
        : "bg-ds-destructive/10 border-ds-destructive/20"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={clsx("text-lg", eligible ? "text-ds-success" : "text-ds-destructive")}>
              {eligible ? "✓" : "✗"}
            </span>
            <h4 className={clsx("text-sm font-semibold", eligible ? "text-ds-success" : "text-ds-destructive")}>
              {eligible ? t(locale, "bnpl.eligible") : t(locale, "bnpl.not_eligible")}
            </h4>
          </div>
          {reason && (
            <p className="text-sm text-ds-muted-foreground">{reason}</p>
          )}
          {(minAmount !== undefined || maxAmount !== undefined) && (
            <p className="text-xs text-ds-muted-foreground mt-2">
              {minAmount !== undefined && (
                <span>{t(locale, "bnpl.min_amount")}: {formatCurrency(minAmount, currency, loc)}</span>
              )}
              {minAmount !== undefined && maxAmount !== undefined && <span className="mx-2">·</span>}
              {maxAmount !== undefined && (
                <span>{t(locale, "bnpl.max_amount")}: {formatCurrency(maxAmount, currency, loc)}</span>
              )}
            </p>
          )}
        </div>
        {onCheck && (
          <button
            onClick={onCheck}
            className="px-3 py-1.5 text-xs font-medium text-ds-primary bg-ds-background border border-ds-border rounded-lg hover:bg-ds-muted transition-colors"
          >
            {t(locale, "bnpl.check_eligibility")}
          </button>
        )}
      </div>
    </div>
  )
}
