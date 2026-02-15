import React from 'react'

interface MapMarker {
  lat: number
  lng: number
  title: string
  id: string
}

interface MapZone {
  name: string
  bounds: { north: number; south: number; east: number; west: number }
}

interface MapComponentProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  zones?: MapZone[]
  interactive?: boolean
  height?: string | number
}

export const MapComponent: React.FC<MapComponentProps> = ({
  center = { lat: 0, lng: 0 },
  zoom: initialZoom = 10,
  markers = [],
  onMarkerClick,
  zones = [],
  interactive = true,
  height = 400,
}) => {
  const [zoom, setZoom] = React.useState(initialZoom)
  const [selectedMarker, setSelectedMarker] = React.useState<string | null>(null)

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker.id)
    onMarkerClick?.(marker)
  }

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden" style={{ height }}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-ds-border bg-ds-muted/30">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium text-ds-foreground">Map View</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-ds-muted-foreground">
            <span>{center.lat.toFixed(4)}, {center.lng.toFixed(4)}</span>
            <span className="mx-1">·</span>
            <span>Zoom: {zoom}</span>
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 relative bg-ds-muted/10 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ds-border" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 text-center p-6">
              <div className="w-16 h-16 rounded-full bg-ds-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-sm text-ds-muted-foreground">Connect map provider for full functionality</p>
              {markers.length > 0 && (
                <span className="text-xs text-ds-muted-foreground">{markers.length} marker{markers.length !== 1 ? 's' : ''} · {zones.length} zone{zones.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {interactive && (
              <div className="absolute end-3 top-3 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setZoom(Math.min(zoom + 1, 20))}
                  className="w-8 h-8 bg-ds-card border border-ds-border rounded-md flex items-center justify-center text-ds-foreground hover:bg-ds-muted transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(Math.max(zoom - 1, 1))}
                  className="w-8 h-8 bg-ds-card border border-ds-border rounded-md flex items-center justify-center text-ds-foreground hover:bg-ds-muted transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" /></svg>
                </button>
              </div>
            )}
          </div>

          {(markers.length > 0 || zones.length > 0) && (
            <div className="w-64 border-l border-ds-border overflow-y-auto">
              {markers.length > 0 && (
                <div className="p-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ds-muted-foreground mb-2">Markers</h4>
                  <div className="space-y-1">
                    {markers.map((marker) => (
                      <button
                        key={marker.id}
                        type="button"
                        onClick={() => handleMarkerClick(marker)}
                        className={`w-full flex items-start gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                          selectedMarker === marker.id ? 'bg-ds-primary/10 text-ds-primary' : 'hover:bg-ds-muted text-ds-foreground'
                        }`}
                      >
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{marker.title}</div>
                          <div className="text-[10px] text-ds-muted-foreground">{marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {zones.length > 0 && (
                <div className="p-3 border-t border-ds-border">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ds-muted-foreground mb-2">Zones</h4>
                  <div className="space-y-1">
                    {zones.map((zone, i) => (
                      <div key={i} className="px-2 py-1.5 rounded-md hover:bg-ds-muted transition-colors">
                        <div className="text-sm font-medium text-ds-foreground">{zone.name}</div>
                        <div className="text-[10px] text-ds-muted-foreground">
                          N:{zone.bounds.north.toFixed(2)} S:{zone.bounds.south.toFixed(2)} E:{zone.bounds.east.toFixed(2)} W:{zone.bounds.west.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
