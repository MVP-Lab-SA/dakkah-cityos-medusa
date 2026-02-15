import { useState, useCallback } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface GalleryImage {
  id: string
  src: string
  alt: string
  thumbnail?: string
}

interface ImageGalleryProps {
  locale?: string
  images: GalleryImage[]
}

export function ImageGallery({ locale: localeProp, images }: ImageGalleryProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % images.length) + images.length) % images.length)
    },
    [images.length]
  )

  if (images.length === 0) return null

  const current = images[activeIndex]

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square bg-ds-accent rounded-lg overflow-hidden group">
          <img
            src={current.src}
            alt={current.alt}
            className="w-full h-full object-contain cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => goTo(activeIndex - 1)}
                className="absolute start-2 top-1/2 -translate-y-1/2 p-2 bg-ds-card/80 rounded-full text-ds-text hover:bg-ds-card transition-colors opacity-0 group-hover:opacity-100"
                aria-label={t(locale, "blocks.previous_slide")}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => goTo(activeIndex + 1)}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-2 bg-ds-card/80 rounded-full text-ds-text hover:bg-ds-card transition-colors opacity-0 group-hover:opacity-100"
                aria-label={t(locale, "blocks.next_slide")}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <div className="absolute bottom-2 end-2 bg-ds-card/80 px-2 py-1 rounded text-xs text-ds-muted">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  i === activeIndex ? "border-ds-primary" : "border-ds-border hover:border-ds-primary/50"
                }`}
                aria-label={`${t(locale, "blocks.go_to_slide")} ${i + 1}`}
              >
                <img loading="lazy" src={img.thumbnail || img.src} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={t(locale, "common.lightbox")} tabIndex={-1} onClick={() => setLightboxOpen(false)} onKeyDown={(e) => { if (e.key === "Escape") setLightboxOpen(false); }}>
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 end-4 p-2 text-white hover:text-ds-muted-foreground/50 transition-colors z-10"
            aria-label={t(locale, "common.close")}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={current.src}
            alt={current.alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1) }}
                className="absolute start-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-ds-muted-foreground/50"
                aria-label={t(locale, "blocks.previous_slide")}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1) }}
                className="absolute end-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-ds-muted-foreground/50"
                aria-label={t(locale, "blocks.next_slide")}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
