import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface StoreLocationInfo {
  id: string
  name: string
  address: string
  distance?: string
  pickupAvailable: boolean
  phone?: string
  hours?: string
  stockStatus?: "in-stock" | "low-stock" | "out-of-stock"
}

interface StoreAvailabilityCardProps {
  store: StoreLocationInfo
  isSelected?: boolean
  onSelect?: (storeId: string) => void
  locale?: string
  className?: string
}

const stockConfig: Record<string, { i18nKey: string; colorClass: string }> = {
  "in-stock": { i18nKey: "bopis.in_stock", colorClass: "bg-ds-success/10 text-ds-success" },
  "low-stock": { i18nKey: "bopis.low_stock", colorClass: "bg-ds-warning/10 text-ds-warning" },
  "out-of-stock": { i18nKey: "bopis.out_of_stock", colorClass: "bg-ds-destructive/10 text-ds-destructive" },
}

export function StoreAvailabilityCard({
  store,
  isSelected = false,
  onSelect,
  locale: localeProp,
  className,
}: StoreAvailabilityCardProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const stock = store.stockStatus ? stockConfig[store.stockStatus] : null

  return (
    <button
      onClick={() => onSelect?.(store.id)}
      disabled={!store.pickupAvailable}
      className={clsx(
        "w-full text-start rounded-lg border p-4 transition-all",
        isSelected
          ? "border-ds-primary bg-ds-primary/5 ring-2 ring-ds-primary"
          : "border-ds-border bg-ds-background hover:border-ds-foreground",
        !store.pickupAvailable && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-ds-foreground truncate">{store.name}</h4>
            {isSelected && (
              <div className="w-5 h-5 rounded-full bg-ds-primary flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-ds-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-sm text-ds-muted-foreground mt-1">{store.address}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {store.distance && (
              <span className="text-xs text-ds-muted-foreground flex items-center gap-1">📍 {store.distance}</span>
            )}
            {store.phone && (
              <span className="text-xs text-ds-muted-foreground flex items-center gap-1">📞 {store.phone}</span>
            )}
            {store.hours && (
              <span className="text-xs text-ds-muted-foreground flex items-center gap-1">🕐 {store.hours}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className={clsx(
              "text-xs font-medium px-2 py-1 rounded",
              store.pickupAvailable
                ? "bg-ds-success/10 text-ds-success"
                : "bg-ds-muted text-ds-muted-foreground"
            )}
          >
            {store.pickupAvailable
              ? t(locale, "delivery.available")
              : t(locale, "delivery.unavailable")}
          </span>
          {stock && (
            <span className={clsx("text-xs font-medium px-2 py-1 rounded", stock.colorClass)}>
              {t(locale, stock.i18nKey)}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
