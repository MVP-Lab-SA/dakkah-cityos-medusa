import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import type { POI } from "@/lib/hooks/use-content"

interface POIMapViewProps {
  pois: Partial<POI>[]
  center?: { lat: number; lng: number }
  zoom?: number
  selectedPOIId?: string
  onPOISelect?: (id: string) => void
  height?: string
  locale?: string
}

export function POIMapView({
  pois,
  center,
  zoom = 13,
  selectedPOIId,
  onPOISelect,
  height = "300px",
  locale: localeProp,
}: POIMapViewProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div
      className="bg-ds-muted rounded-lg border border-ds-border relative overflow-hidden"
      style={{ height }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl mb-2">🗺️</span>
        <p className="text-sm font-medium text-ds-foreground">
          {t(locale, "poi.map_view")}
        </p>
        <p className="text-xs text-ds-muted-foreground mt-1">
          {pois.length} {t(locale, "blocks.map_locations")}
        </p>
      </div>

      {pois.length > 0 && (
        <div className="absolute bottom-0 start-0 end-0 p-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pois.slice(0, 5).map((poi) => (
              <button
                key={poi.id}
                onClick={() => poi.id && onPOISelect?.(poi.id)}
                className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  selectedPOIId === poi.id
                    ? "bg-ds-primary text-ds-primary-foreground"
                    : "bg-ds-background text-ds-foreground border border-ds-border hover:bg-ds-muted"
                }`}
              >
                📍 {poi.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
