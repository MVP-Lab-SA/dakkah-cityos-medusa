import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface Video {
  id: string
  src: string
  thumbnail: string
  title: string
  duration?: string
}

interface ProductVideoGalleryProps {
  locale?: string
  videos: Video[]
}

export function ProductVideoGallery({ locale: localeProp, videos }: ProductVideoGalleryProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [activeIndex, setActiveIndex] = useState(0)

  if (videos.length === 0) return null

  const current = videos[activeIndex]

  return (
    <div className="space-y-3">
      <div className="relative aspect-video bg-ds-accent rounded-lg overflow-hidden">
        <video
          key={current.id}
          src={current.src}
          controls
          className="w-full h-full object-contain"
          poster={current.thumbnail}
        >
          <track kind="captions" />
        </video>
      </div>

      {videos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
          {videos.map((video, i) => (
            <button
              key={video.id}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-28 rounded-md overflow-hidden border-2 transition-colors ${
                i === activeIndex ? "border-ds-primary" : "border-ds-border hover:border-ds-primary/50"
              }`}
            >
              <div className="aspect-video relative">
                <img loading="lazy" src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                {video.duration && (
                  <span className="absolute bottom-1 end-1 bg-black/70 text-white text-[10px] px-1 rounded">
                    {video.duration}
                  </span>
                )}
              </div>
              <p className="text-xs text-ds-muted p-1 truncate">{video.title}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
