import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface StoreLocationInfo {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  distance?: string
  pickupAvailable: boolean
  phone?: string
  hours?: string
  stockStatus?: "in-stock" | "low-stock" | "out-of-stock"
}

interface StoreCardProps {
  store: StoreLocationInfo
  isSelected?: boolean
  onSelect?: (storeId: string) => void
  showDistance?: boolean
  showHours?: boolean
  locale?: string
  className?: string
}

const stockConfig: Record<string, { i18nKey: string; colorClass: string }> = {
  "in-stock": { i18nKey: "bopis.in_stock", colorClass: "bg-ds-success/10 text-ds-success" },
  "low-stock": { i18nKey: "bopis.low_stock", colorClass: "bg-ds-warning/10 text-ds-warning" },
  "out-of-stock": { i18nKey: "bopis.out_of_stock", colorClass: "bg-ds-destructive/10 text-ds-destructive" },
}

export function StoreCard({
  store,
  isSelected = false,
  onSelect,
  showDistance = true,
  showHours = true,
  locale: localeProp,
  className,
}: StoreCardProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <button
      onClick={() => onSelect?.(store.id)}
      disabled={!store.pickupAvailable}
      className={clsx(
        "w-full text-start p-4 rounded-xl border transition-all",
        isSelected
          ? "border-ds-primary bg-ds-primary/5 ring-2 ring-ds-primary/20"
          : store.pickupAvailable
            ? "border-ds-border bg-ds-card hover:border-ds-primary/50"
            : "border-ds-border bg-ds-muted opacity-60 cursor-not-allowed",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏪</span>
            <h4 className="text-sm font-semibold text-ds-foreground truncate">{store.name}</h4>
          </div>
          <p className="text-xs text-ds-muted-foreground mt-1">{store.address}</p>
          {showHours && store.hours && (
            <p className="text-xs text-ds-muted-foreground mt-0.5">🕐 {store.hours}</p>
          )}
          {store.phone && (
            <p className="text-xs text-ds-muted-foreground mt-0.5">📞 {store.phone}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {showDistance && store.distance && (
            <span className="text-xs font-medium text-ds-muted-foreground">{store.distance}</span>
          )}
          {store.stockStatus && (
            <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full", stockConfig[store.stockStatus]?.colorClass)}>
              {t(locale, stockConfig[store.stockStatus]?.i18nKey || "bopis.in_stock")}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
