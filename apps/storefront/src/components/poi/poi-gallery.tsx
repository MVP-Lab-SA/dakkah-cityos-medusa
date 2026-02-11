import { useState } from "react"
import { useTenant } from "@/lib/context/tenant-context"

interface GalleryImage {
  url: string
  alt?: string
}

interface POIGalleryProps {
  images: GalleryImage[]
  name?: string
  locale?: string
}

export function POIGallery({ images, name, locale: localeProp }: POIGalleryProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images.length) return null

  if (images.length === 1) {
    return (
      <div className="rounded-lg overflow-hidden bg-ds-muted">
        <img
          src={images[0].url}
          alt={images[0].alt || name || ""}
          className="w-full h-64 md:h-80 object-cover"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="rounded-lg overflow-hidden bg-ds-muted">
        <img
          src={images[selectedIndex].url}
          alt={images[selectedIndex].alt || name || ""}
          className="w-full h-64 md:h-80 object-cover"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
              i === selectedIndex ? "border-ds-primary" : "border-transparent hover:border-ds-border"
            }`}
          >
            <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
