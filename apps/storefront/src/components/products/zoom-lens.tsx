import { useState, useRef, useCallback } from "react"
import { useTenant } from "../../lib/context/tenant-context"

interface ZoomLensProps {
  locale?: string
  src: string
  alt: string
  zoomLevel?: number
}

export function ZoomLens({ locale: localeProp, src, alt, zoomLevel = 2.5 }: ZoomLensProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [isZooming, setIsZooming] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setPosition({ x, y })
    },
    []
  )

  return (
    <div
      ref={containerRef}
      className="relative aspect-square bg-ds-accent rounded-lg overflow-hidden cursor-crosshair"
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
      onMouseMove={handleMouseMove}
    >
      <img loading="lazy" src={src} alt={alt} className="w-full h-full object-contain" />

      {isZooming && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
    </div>
  )
}
