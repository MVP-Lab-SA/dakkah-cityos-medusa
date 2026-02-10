import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"

interface TryBeforeYouBuyProps {
  productTitle: string
  thumbnail?: string
  price: number
  currencyCode?: string
  trialDays: number
  terms: string[]
  afterTrialDescription: string
  locale: string
  onTryIt?: () => void
  isLoading?: boolean
}

export function TryBeforeYouBuy({
  productTitle,
  thumbnail,
  price,
  currencyCode = "USD",
  trialDays,
  terms,
  afterTrialDescription,
  locale,
  onTryIt,
  isLoading,
}: TryBeforeYouBuyProps) {
  if (isLoading) {
    return <div className="h-48 bg-ds-muted rounded-lg animate-pulse" />
  }

  return (
    <div className="bg-ds-background rounded-lg border border-ds-border overflow-hidden">
      <div className="bg-ds-primary/5 border-b border-ds-border px-4 sm:px-6 py-3">
        <h3 className="font-semibold text-ds-foreground text-sm">
          {t(locale, "commerce.try_before_you_buy")}
        </h3>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-start gap-4">
          {thumbnail && (
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-ds-muted flex-shrink-0">
              <img src={thumbnail} alt={productTitle} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-ds-foreground text-sm truncate">{productTitle}</h4>
            <p className="text-sm text-ds-muted-foreground">
              {formatCurrency(price, currencyCode, locale as SupportedLocale)}
            </p>
          </div>
        </div>

        <div className="bg-ds-muted rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-ds-primary">{trialDays}</p>
          <p className="text-sm text-ds-muted-foreground">
            {t(locale, "commerce.trial_days")}
          </p>
        </div>

        {terms.length > 0 && (
          <div>
            <p className="text-sm font-medium text-ds-foreground mb-2">
              {t(locale, "commerce.trial_terms")}
            </p>
            <ul className="space-y-1.5">
              {terms.map((term, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ds-muted-foreground">
                  <span className="text-ds-success mt-0.5 flex-shrink-0">✓</span>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-ds-muted rounded-lg p-3">
          <p className="text-xs font-medium text-ds-foreground mb-1">
            {t(locale, "commerce.after_trial")}
          </p>
          <p className="text-xs text-ds-muted-foreground">{afterTrialDescription}</p>
        </div>

        <button
          type="button"
          onClick={onTryIt}
          className="w-full px-4 py-2.5 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          {t(locale, "commerce.try_it")}
        </button>
      </div>
    </div>
  )
}
