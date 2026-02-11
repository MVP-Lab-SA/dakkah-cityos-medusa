import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface OrderTrackingMapProps {
  orderId: string
  driverLocation?: { lat: number; lng: number }
  destinationLocation: { lat: number; lng: number }
  pickupLocation?: { lat: number; lng: number }
  estimatedArrival?: string
  status: "preparing" | "picked-up" | "in-transit" | "nearby" | "delivered"
  height?: string
  locale?: string
  className?: string
}

const statusConfig: Record<string, { icon: string; i18nKey: string; colorClass: string }> = {
  preparing: { icon: "📋", i18nKey: "tracking.preparing", colorClass: "text-ds-warning" },
  "picked-up": { icon: "📦", i18nKey: "tracking.picked_up", colorClass: "text-ds-info" },
  "in-transit": { icon: "🚚", i18nKey: "tracking.in_transit", colorClass: "text-ds-primary" },
  nearby: { icon: "📍", i18nKey: "tracking.nearby", colorClass: "text-ds-success" },
  delivered: { icon: "✅", i18nKey: "tracking.delivered", colorClass: "text-ds-success" },
}

export function OrderTrackingMap({
  orderId,
  driverLocation,
  destinationLocation: _dest,
  pickupLocation: _pickup,
  estimatedArrival,
  status,
  height = "h-64",
  locale: localeProp,
  className,
}: OrderTrackingMapProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const config = statusConfig[status] || statusConfig.preparing

  return (
    <div className={clsx("bg-ds-card border border-ds-border rounded-xl overflow-hidden", className)}>
      <div className={clsx("bg-ds-muted relative flex items-center justify-center", height)}>
        <div className="text-center">
          <div className="w-16 h-16 bg-ds-background/50 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-8 h-8 text-ds-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
          </div>
          <p className="text-xs text-ds-muted-foreground">{t(locale, "tracking.map_placeholder")}</p>
        </div>

        {driverLocation && (
          <div className="absolute top-3 end-3 bg-ds-background rounded-lg border border-ds-border px-3 py-2 shadow-sm">
            <p className="text-xs text-ds-muted-foreground">{t(locale, "tracking.driver_location")}</p>
            <p className="text-xs font-mono text-ds-foreground">
              {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}
            </p>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <div>
              <p className={clsx("font-medium text-sm", config.colorClass)}>
                {t(locale, config.i18nKey)}
              </p>
              <p className="text-xs text-ds-muted-foreground">
                {t(locale, "tracking.order_id")}: {orderId}
              </p>
            </div>
          </div>
          {estimatedArrival && status !== "delivered" && (
            <div className="text-end">
              <p className="text-xs text-ds-muted-foreground">{t(locale, "tracking.eta")}</p>
              <p className="text-sm font-semibold text-ds-foreground">{estimatedArrival}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
