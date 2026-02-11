import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface StockUrgencyProps {
  locale?: string
  stockCount: number
  lowStockThreshold?: number
  showExact?: boolean
}

export function StockUrgency({
  locale: localeProp,
  stockCount,
  lowStockThreshold = 10,
  showExact = false,
}: StockUrgencyProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (stockCount <= 0) {
    return (
      <div className="flex items-center gap-2 text-ds-destructive">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-sm font-medium">{t(locale, "product.out_of_stock")}</span>
      </div>
    )
  }

  if (stockCount <= lowStockThreshold) {
    const percentage = (stockCount / lowStockThreshold) * 100

    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ds-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ds-destructive" />
          </span>
          <span className="text-sm font-medium text-ds-destructive">
            {showExact
              ? `${t(locale, "productDisplay.only_x_left").replace("{count}", String(stockCount))}`
              : t(locale, "productDisplay.low_stock")}
          </span>
        </div>
        <div className="h-1.5 bg-ds-destructive/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-ds-destructive rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-ds-muted">{t(locale, "productDisplay.order_soon")}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-ds-success">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm font-medium">{t(locale, "product.in_stock")}</span>
    </div>
  )
}
