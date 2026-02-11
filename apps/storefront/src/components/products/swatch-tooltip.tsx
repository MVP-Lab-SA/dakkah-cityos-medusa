import { useState } from "react"
import { useTenant } from "../../lib/context/tenant-context"

interface Swatch {
  id: string
  color: string
  name: string
  hex: string
  image?: string
  inStock?: boolean
}

interface SwatchTooltipProps {
  locale?: string
  swatches: Swatch[]
  selected?: string
  onSelect?: (swatch: Swatch) => void
}

export function SwatchTooltip({ locale: localeProp, swatches, selected, onSelect }: SwatchTooltipProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [hoveredSwatch, setHoveredSwatch] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap gap-2">
      {swatches.map((swatch) => (
        <div key={swatch.id} className="relative">
          <button
            className={`relative w-9 h-9 rounded-full border-2 transition-all ${
              selected === swatch.id
                ? "border-ds-primary ring-2 ring-ds-primary/30 scale-110"
                : "border-ds-border hover:border-ds-primary/50 hover:scale-105"
            } ${!swatch.inStock ? "opacity-40 cursor-not-allowed" : ""}`}
            style={{ backgroundColor: swatch.hex }}
            onClick={() => swatch.inStock !== false && onSelect?.(swatch)}
            onMouseEnter={() => setHoveredSwatch(swatch.id)}
            onMouseLeave={() => setHoveredSwatch(null)}
            onFocus={() => setHoveredSwatch(swatch.id)}
            onBlur={() => setHoveredSwatch(null)}
            disabled={swatch.inStock === false}
            aria-label={swatch.name}
            title={swatch.name}
          >
            {!swatch.inStock && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-full h-0.5 bg-ds-destructive rotate-45 rounded" />
              </span>
            )}
          </button>

          {hoveredSwatch === swatch.id && (
            <div className="absolute bottom-full mb-2 start-1/2 -translate-x-1/2 whitespace-nowrap z-10">
              <div className="bg-ds-card border border-ds-border rounded-md shadow-lg px-3 py-2">
                <p className="text-xs font-medium text-ds-text">{swatch.name}</p>
                {swatch.image && (
                  <img
                    src={swatch.image}
                    alt={swatch.name}
                    className="w-16 h-16 object-cover rounded mt-1"
                  />
                )}
              </div>
              <div className="w-2 h-2 bg-ds-card border-b border-e border-ds-border rotate-45 absolute start-1/2 -translate-x-1/2 -bottom-1" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
