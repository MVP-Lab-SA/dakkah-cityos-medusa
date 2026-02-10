import { t } from "@/lib/i18n"
import { clsx } from "clsx"

interface StoreLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  distance?: string
  pickupAvailable: boolean
  phone?: string
  hours?: string
}

interface StorePickupSelectorProps {
  stores: StoreLocation[]
  selectedStoreId?: string
  onStoreSelect: (storeId: string) => void
  showMap?: boolean
  locale: string
  className?: string
}

export function StorePickupSelector({
  stores,
  selectedStoreId,
  onStoreSelect,
  showMap = false,
  locale,
  className,
}: StorePickupSelectorProps) {
  if (!stores.length) {
    return (
      <div className={clsx("bg-ds-muted rounded-lg p-8 text-center", className)}>
        <svg
          className="w-12 h-12 text-ds-muted-foreground mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0V3h18v6.35"
          />
        </svg>
        <p className="text-ds-muted-foreground">{t(locale, "delivery.no_stores")}</p>
      </div>
    )
  }

  return (
    <div className={clsx("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-ds-foreground">
        {t(locale, "delivery.select_store")}
      </h3>

      {showMap && (
        <div className="bg-ds-muted rounded-xl border border-ds-border h-48 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-10 h-10 text-ds-muted-foreground/30 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <p className="text-xs text-ds-muted-foreground">Map view</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {stores.map((store) => {
          const isSelected = selectedStoreId === store.id

          return (
            <button
              key={store.id}
              onClick={() => store.pickupAvailable && onStoreSelect(store.id)}
              disabled={!store.pickupAvailable}
              className={clsx(
                "w-full text-start rounded-lg border p-4 transition-all",
                isSelected
                  ? "border-ds-foreground bg-ds-primary/5 ring-2 ring-ds-primary"
                  : "border-ds-border bg-ds-background hover:border-ds-foreground",
                !store.pickupAvailable && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-start gap-3">
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
                      <span className="text-xs text-ds-muted-foreground flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {store.distance}
                      </span>
                    )}

                    {store.phone && (
                      <span className="text-xs text-ds-muted-foreground flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        {store.phone}
                      </span>
                    )}

                    {store.hours && (
                      <span className="text-xs text-ds-muted-foreground flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {store.hours}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={clsx(
                    "text-xs font-medium px-2 py-1 rounded flex-shrink-0",
                    store.pickupAvailable
                      ? "bg-ds-success/10 text-ds-success"
                      : "bg-ds-muted text-ds-muted-foreground"
                  )}
                >
                  {store.pickupAvailable
                    ? t(locale, "delivery.available")
                    : t(locale, "delivery.unavailable")}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
