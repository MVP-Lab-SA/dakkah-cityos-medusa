import { formatCurrency, type SupportedLocale } from "@/lib/i18n"

interface CampaignProgressBarProps {
  raised: number
  goal: number
  currencyCode: string
  locale: string
  showPercentage?: boolean
  showAmounts?: boolean
  animated?: boolean
}

export function CampaignProgressBar({
  raised,
  goal,
  currencyCode,
  locale,
  showPercentage = true,
  showAmounts = true,
  animated = true,
}: CampaignProgressBarProps) {
  const percentage = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0

  return (
    <div>
      <div className="w-full h-3 bg-ds-muted rounded-full overflow-hidden">
        <div
          className={`h-full bg-ds-primary rounded-full ${animated ? "transition-all duration-1000 ease-out" : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        {showAmounts && (
          <div className="text-sm">
            <span className="font-semibold text-ds-foreground">
              {formatCurrency(raised, currencyCode, locale as SupportedLocale)}
            </span>
            <span className="text-ds-muted-foreground">
              {" "}/ {formatCurrency(goal, currencyCode, locale as SupportedLocale)}
            </span>
          </div>
        )}
        {showPercentage && (
          <span className="text-sm font-medium text-ds-primary">{percentage}%</span>
        )}
      </div>
    </div>
  )
}
