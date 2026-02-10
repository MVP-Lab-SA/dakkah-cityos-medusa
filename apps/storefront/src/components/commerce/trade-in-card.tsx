import { useState } from "react"
import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"

interface TradeInCardProps {
  productId: string
  title: string
  thumbnail?: string
  estimatedValue: number
  currencyCode?: string
  condition?: "excellent" | "good" | "fair" | "poor"
  status?: "pending" | "evaluated" | "accepted" | "rejected"
  locale: string
  onConditionChange?: (condition: "excellent" | "good" | "fair" | "poor") => void
  onSubmit?: () => void
}

const conditionOptions = ["excellent", "good", "fair", "poor"] as const

const statusColors: Record<string, string> = {
  pending: "bg-ds-muted text-ds-muted-foreground",
  evaluated: "bg-ds-primary/10 text-ds-primary",
  accepted: "bg-ds-success/10 text-ds-success",
  rejected: "bg-ds-destructive/10 text-ds-destructive",
}

export function TradeInCard({
  title,
  thumbnail,
  estimatedValue,
  currencyCode = "USD",
  condition,
  status,
  locale,
  onConditionChange,
  onSubmit,
}: TradeInCardProps) {
  const [selectedCondition, setSelectedCondition] = useState<typeof conditionOptions[number]>(
    condition || "good"
  )

  const handleConditionChange = (c: typeof conditionOptions[number]) => {
    setSelectedCondition(c)
    onConditionChange?.(c)
  }

  return (
    <div className="bg-ds-background rounded-lg border border-ds-border p-4 sm:p-6">
      <div className="flex items-start gap-4">
        {thumbnail ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-ds-muted flex-shrink-0">
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-ds-muted flex-shrink-0 flex items-center justify-center">
            <span className="text-ds-muted-foreground text-xs">
              {t(locale, "commerce.no_image")}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-ds-foreground truncate">{title}</h3>
            {status && (
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${statusColors[status] || statusColors.pending}`}>
                {t(locale, `commerce.status_${status}`)}
              </span>
            )}
          </div>

          <div className="mt-2">
            <p className="text-sm text-ds-muted-foreground">
              {t(locale, "commerce.estimated_value")}
            </p>
            <p className="text-lg font-bold text-ds-foreground">
              {formatCurrency(estimatedValue, currencyCode, locale as SupportedLocale)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-ds-foreground mb-2">
          {t(locale, "commerce.select_condition")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {conditionOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleConditionChange(c)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                selectedCondition === c
                  ? "border-ds-primary bg-ds-primary text-ds-primary-foreground"
                  : "border-ds-border bg-ds-background text-ds-muted-foreground hover:bg-ds-muted"
              }`}
            >
              {t(locale, `commerce.condition_${c}`)}
            </button>
          ))}
        </div>
      </div>

      {(!status || status === "pending") && (
        <button
          type="button"
          onClick={onSubmit}
          className="mt-4 w-full px-4 py-2.5 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          {t(locale, "commerce.submit_trade_in")}
        </button>
      )}
    </div>
  )
}
