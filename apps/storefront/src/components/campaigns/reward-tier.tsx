import { useLocale } from "@/lib/context/tenant-context"
import { formatCurrency, type SupportedLocale } from "@/lib/i18n"

interface RewardTierProps {
  id: string
  title: string
  description?: string
  pledgeAmount: number
  currencyCode: string
  estimatedDelivery?: string
  limitedQuantity?: number
  claimed?: number
  includes?: string[]
  onPledge: (tierId: string) => void
}

export function RewardTier({
  id,
  title,
  description,
  pledgeAmount,
  currencyCode,
  estimatedDelivery,
  limitedQuantity,
  claimed,
  includes,
  onPledge,
}: RewardTierProps) {
  const { locale } = useLocale()
  const remaining = limitedQuantity !== undefined && claimed !== undefined
    ? limitedQuantity - claimed
    : undefined
  const soldOut = remaining !== undefined && remaining <= 0

  return (
    <div className={`bg-ds-background rounded-lg border-2 p-6 transition-colors ${soldOut ? "border-ds-border opacity-60" : "border-ds-border hover:border-ds-primary"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm text-ds-muted-foreground">Pledge</div>
          <div className="text-2xl font-bold text-ds-foreground mt-1">
            {formatCurrency(pledgeAmount, currencyCode, locale as SupportedLocale)}
          </div>
        </div>
        {remaining !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded ${soldOut ? "bg-ds-destructive/10 text-ds-destructive" : "bg-ds-muted text-ds-muted-foreground"}`}>
            {soldOut ? "Sold Out" : `${remaining} left of ${limitedQuantity}`}
          </span>
        )}
      </div>

      <h4 className="text-lg font-semibold text-ds-foreground mt-4">{title}</h4>

      {description && (
        <p className="text-sm text-ds-muted-foreground mt-2">{description}</p>
      )}

      {includes && includes.length > 0 && (
        <ul className="mt-3 space-y-1">
          {includes.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ds-foreground">
              <svg className="w-4 h-4 text-ds-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      )}

      {estimatedDelivery && (
        <p className="text-xs text-ds-muted-foreground mt-4">
          Estimated delivery: {estimatedDelivery}
        </p>
      )}

      <button
        onClick={() => onPledge(id)}
        disabled={soldOut}
        className="w-full mt-4 px-4 py-2 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {soldOut ? "Sold Out" : "Pledge"}
      </button>
    </div>
  )
}
