import { useRef } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface RecentProduct {
  id: string
  title: string
  image: string
  price: string
  originalPrice?: string
  href?: string
}

interface RecentlyViewedProps {
  locale?: string
  className?: string
  products?: RecentProduct[]
  onProductClick?: (id: string) => void
}

export function RecentlyViewed({
  locale: localeProp,
  className = "",
  products = [],
  onProductClick,
}: RecentlyViewedProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const scrollRef = useRef<HTMLDivElement>(null)

  if (products.length === 0) return null

  const scroll = (dir: "start" | "end") => {
    if (!scrollRef.current) return
    const amount = 240
    scrollRef.current.scrollBy({
      left: dir === "end" ? amount : -amount,
      behavior: "smooth",
    })
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ds-text">
          {t(locale, "interactive.recently_viewed")}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("start")}
            className="p-1.5 rounded-md border border-ds-border text-ds-muted hover:text-ds-text hover:bg-ds-accent transition-colors"
            aria-label={t(locale, "blocks.previous_slide")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("end")}
            className="p-1.5 rounded-md border border-ds-border text-ds-muted hover:text-ds-text hover:bg-ds-accent transition-colors"
            aria-label={t(locale, "blocks.next_slide")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductClick?.(product.id)}
            className="flex-shrink-0 w-36 group text-start"
          >
            <div className="aspect-square bg-ds-accent rounded-lg overflow-hidden mb-2">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <p className="text-xs text-ds-text font-medium truncate">{product.title}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs font-semibold text-ds-text">{product.price}</span>
              {product.originalPrice && (
                <span className="text-[10px] text-ds-muted line-through">{product.originalPrice}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
