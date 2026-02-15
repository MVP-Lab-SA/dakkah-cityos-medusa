import React from 'react'
import { t } from '@/lib/i18n'

interface LocationItem {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  phone?: string
  hours?: string
  image?: {
    url: string
    alt?: string
  }
}

interface MapBlockProps {
  heading?: string
  locations: LocationItem[]
  zoom?: number
  height?: 'sm' | 'md' | 'lg' | 'xl'
  showList?: boolean
  interactive?: boolean
  locale?: string
}

const heightMap = {
  sm: 'h-48 md:h-56',
  md: 'h-64 md:h-80',
  lg: 'h-80 md:h-96',
  xl: 'h-96 md:h-[32rem]',
}

export const MapBlock: React.FC<MapBlockProps> = ({
  heading,
  locations,
  height = 'md',
  showList = true,
  locale = 'en',
}) => {
  if (!locations || !locations.length) return null

  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const selected = locations.find((l) => l.id === selectedId)

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground text-center mb-8 md:mb-12">
            {heading}
          </h2>
        )}

        <div className="rounded-lg border border-ds-border overflow-hidden">
          <div className={`relative bg-ds-muted ${heightMap[height]}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto text-ds-muted-foreground mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
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
                <p className="text-sm text-ds-muted-foreground">
                  {t(locale, 'blocks.map_placeholder')}
                </p>
                <p className="text-xs text-ds-muted-foreground mt-1">
                  {locations.length} {t(locale, 'blocks.map_locations')}
                </p>
              </div>
            </div>

            {locations.map((loc, index) => {
              const xPercent = 15 + ((index * 37) % 70)
              const yPercent = 20 + ((index * 29) % 55)
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setSelectedId(selectedId === loc.id ? null : loc.id)}
                  className="absolute group"
                  style={{ insetInlineStart: `${xPercent}%`, top: `${yPercent}%` }}
                  aria-label={loc.name}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                      selectedId === loc.id
                        ? 'bg-ds-primary text-ds-primary-foreground scale-110'
                        : 'bg-ds-card text-ds-foreground'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              )
            })}

            {selected && (
              <div className="absolute bottom-4 start-4 end-4 md:start-4 md:end-auto md:max-w-sm bg-ds-card border border-ds-border rounded-lg p-4 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-ds-foreground truncate">{selected.name}</h4>
                    <p className="text-sm text-ds-muted-foreground mt-1">{selected.address}</p>
                    {selected.phone && (
                      <p className="text-sm text-ds-muted-foreground mt-1">{selected.phone}</p>
                    )}
                    {selected.hours && (
                      <p className="text-xs text-ds-muted-foreground mt-1">{selected.hours}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="shrink-0 p-1 rounded text-ds-muted-foreground hover:text-ds-foreground"
                    aria-label={t(locale, 'blocks.close')}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {showList && locations.length > 0 && (
            <div className="divide-y divide-ds-border">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setSelectedId(selectedId === loc.id ? null : loc.id)}
                  className={`w-full flex items-center gap-4 p-4 text-start transition-colors hover:bg-ds-muted ${
                    selectedId === loc.id ? 'bg-ds-muted' : ''
                  }`}
                >
                  {loc.image?.url && (
                    <img
                      src={loc.image.url}
                      alt={loc.image.alt || loc.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ds-foreground truncate">{loc.name}</p>
                    <p className="text-sm text-ds-muted-foreground truncate">{loc.address}</p>
                  </div>
                  {loc.phone && (
                    <span className="hidden md:block text-sm text-ds-muted-foreground shrink-0">
                      {loc.phone}
                    </span>
                  )}
                  <svg
                    className="w-5 h-5 text-ds-muted-foreground shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
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
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
