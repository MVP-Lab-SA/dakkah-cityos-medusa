import { useState, useRef, useCallback } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface Product360ViewerProps {
  locale?: string
  images: string[]
  alt?: string
}

export function Product360Viewer({ locale: localeProp, images, alt = "" }: Product360ViewerProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const lastX = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    lastX.current = e.clientX
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || images.length === 0) return
      const delta = e.clientX - lastX.current
      const sensitivity = 5
      if (Math.abs(delta) > sensitivity) {
        const direction = delta > 0 ? 1 : -1
        setCurrentFrame((prev) => ((prev + direction) % images.length + images.length) % images.length)
        lastX.current = e.clientX
      }
    },
    [isDragging, images.length]
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-ds-accent rounded-lg flex items-center justify-center text-ds-muted text-sm">
        {t(locale, "productDisplay.no_360_images")}
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="aspect-square bg-ds-accent rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          src={images[currentFrame]}
          alt={`${alt} - ${t(locale, "productDisplay.view_360")} ${currentFrame + 1}/${images.length}`}
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
      </div>

      <div className="absolute bottom-3 start-3 bg-ds-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
        <svg className="w-4 h-4 text-ds-muted animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-xs text-ds-muted">{t(locale, "productDisplay.drag_to_rotate")}</span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1 bg-ds-border rounded-full overflow-hidden">
          <div
            className="h-full bg-ds-primary rounded-full transition-all"
            style={{ width: `${((currentFrame + 1) / images.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-ds-muted">
          {currentFrame + 1}/{images.length}
        </span>
      </div>
    </div>
  )
}
