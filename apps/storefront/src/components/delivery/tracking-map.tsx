import { t } from "@/lib/i18n"
import { clsx } from "clsx"

interface TrackingMapProps {
  orderId: string
  driverLocation?: { lat: number; lng: number }
  destinationLocation: { lat: number; lng: number }
  pickupLocation?: { lat: number; lng: number }
  estimatedArrival?: string
  status: "preparing" | "picked-up" | "in-transit" | "nearby" | "delivered"
  height?: string
  locale: string
  className?: string
}

const statusI18nMap: Record<string, string> = {
  preparing: "delivery.preparing",
  "picked-up": "delivery.picked_up",
  "in-transit": "delivery.in_transit",
  nearby: "delivery.nearby",
  delivered: "delivery.delivered",
}

const statusColors: Record<string, string> = {
  preparing: "bg-ds-warning",
  "picked-up": "bg-ds-info",
  "in-transit": "bg-ds-info",
  nearby: "bg-ds-success",
  delivered: "bg-ds-success",
}

export function TrackingMap({
  orderId,
  driverLocation,
  destinationLocation,
  pickupLocation,
  estimatedArrival,
  status,
  height = "300px",
  locale,
  className,
}: TrackingMapProps) {
  const statusLabel = statusI18nMap[status]
    ? t(locale, statusI18nMap[status])
    : status

  return (
    <div
      className={clsx(
        "relative bg-ds-muted rounded-xl border border-ds-border overflow-hidden",
        className
      )}
      style={{ height }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <svg
              className="w-16 h-16 text-ds-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            {(status === "in-transit" || status === "nearby") && driverLocation && (
              <div className="absolute -top-1 -end-1 w-4 h-4 bg-ds-info rounded-full animate-ping" />
            )}
          </div>
          <p className="text-sm text-ds-muted-foreground">
            Map view coming soon
          </p>
        </div>
      </div>

      {pickupLocation && (
        <div className="absolute top-3 start-3 bg-ds-background/90 backdrop-blur rounded-lg px-3 py-2 shadow-sm border border-ds-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ds-info flex-shrink-0" />
            <span className="text-xs font-medium text-ds-foreground">
              {t(locale, "delivery.pickup_location")}
            </span>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 start-3 bg-ds-background/90 backdrop-blur rounded-lg px-3 py-2 shadow-sm border border-ds-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-ds-destructive flex-shrink-0" />
          <span className="text-xs font-medium text-ds-foreground">
            {t(locale, "delivery.destination")}
          </span>
        </div>
      </div>

      <div className="absolute top-3 end-3 bg-ds-background/90 backdrop-blur rounded-lg px-3 py-2 shadow-sm border border-ds-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={clsx("w-2 h-2 rounded-full", statusColors[status] || "bg-ds-muted")} />
            <span className="text-xs font-medium text-ds-foreground">{statusLabel}</span>
          </div>
          {estimatedArrival && (
            <p className="text-xs text-ds-muted-foreground">
              {t(locale, "delivery.estimated_arrival")}: {estimatedArrival}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
