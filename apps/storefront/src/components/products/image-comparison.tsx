import { useState, useRef, useCallback } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface ImageComparisonProps {
  locale?: string
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  alt?: string
}

export function ImageComparison({
  locale: localeProp,
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  alt = "",
}: ImageComparisonProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, x)))
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updatePosition(e.clientX)
  }, [updatePosition])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const bLabel = beforeLabel || t(locale, "productDisplay.before")
  const aLabel = afterLabel || t(locale, "productDisplay.after")

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-ds-accent rounded-lg overflow-hidden select-none cursor-col-resize"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="slider"
      aria-label={t(locale, "productDisplay.comparison_slider")}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
    >
      <img src={afterImage} alt={`${alt} - ${aLabel}`} className="absolute inset-0 w-full h-full object-cover" />

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={beforeImage}
          alt={`${alt} - ${bLabel}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%" }}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-ds-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      <span className="absolute top-3 start-3 bg-ds-card/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-ds-text">
        {bLabel}
      </span>
      <span className="absolute top-3 end-3 bg-ds-card/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-ds-text">
        {aLabel}
      </span>
    </div>
  )
}
