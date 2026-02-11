import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  description?: string
  href?: string
  price?: string
}

interface ImageHotspotsProps {
  locale?: string
  image: string
  alt: string
  hotspots: Hotspot[]
  onHotspotClick?: (hotspot: Hotspot) => void
}

export function ImageHotspots({ locale: localeProp, image, alt, hotspots, onHotspotClick }: ImageHotspotsProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  return (
    <div className="relative aspect-video bg-ds-accent rounded-lg overflow-hidden">
      <img src={image} alt={alt} className="w-full h-full object-cover" />

      {hotspots.map((spot) => (
        <div key={spot.id} className="absolute" style={{ left: `${spot.x}%`, top: `${spot.y}%` }}>
          <button
            className={`relative w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg transition-all ${
              activeHotspot === spot.id
                ? "bg-ds-primary scale-125"
                : "bg-ds-primary/80 hover:bg-ds-primary hover:scale-110"
            }`}
            onClick={() => {
              setActiveHotspot(activeHotspot === spot.id ? null : spot.id)
              onHotspotClick?.(spot)
            }}
            aria-label={spot.label}
          >
            <span className="absolute inset-0 rounded-full bg-ds-primary animate-ping opacity-30" />
            <svg className="w-3 h-3 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {activeHotspot === spot.id && (
            <div className="absolute start-full ms-2 top-1/2 -translate-y-1/2 w-48 bg-ds-card border border-ds-border rounded-lg shadow-lg p-3 z-10">
              <h4 className="text-sm font-medium text-ds-text">{spot.label}</h4>
              {spot.description && (
                <p className="text-xs text-ds-muted mt-1">{spot.description}</p>
              )}
              {spot.price && (
                <p className="text-sm font-semibold text-ds-primary mt-2">{spot.price}</p>
              )}
              {spot.href && (
                <a
                  href={spot.href}
                  className="inline-block mt-2 text-xs text-ds-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t(locale, "blocks.view_details")}
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
