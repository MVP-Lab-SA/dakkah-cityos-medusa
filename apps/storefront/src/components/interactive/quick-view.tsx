import { useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface QuickViewProduct {
  id: string
  title: string
  price: string
  originalPrice?: string
  image: string
  description?: string
  inStock?: boolean
  rating?: number
  reviewCount?: number
}

interface QuickViewProps {
  locale?: string
  product: QuickViewProduct | null
  isOpen: boolean
  onClose: () => void
  onAddToCart?: (productId: string) => void
  onViewFull?: (productId: string) => void
}

export function QuickView({ locale: localeProp, product, isOpen, onClose, onAddToCart, onViewFull }: QuickViewProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [isOpen])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (typeof window !== "undefined" && isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-ds-card border border-ds-border rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
      >
        <button
          onClick={onClose}
          className="absolute top-3 end-3 p-2 bg-ds-accent rounded-full text-ds-muted hover:text-ds-text transition-colors z-10"
          aria-label={t(locale, "common.close")}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          <div className="aspect-square bg-ds-accent">
            <img src={product.image} alt={product.title} className="w-full h-full object-contain p-4" />
          </div>

          <div className="p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-ds-text">{product.title}</h2>

            {product.rating !== undefined && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating!) ? "text-amber-400" : "text-ds-border"}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                {product.reviewCount !== undefined && (
                  <span className="text-xs text-ds-muted">({product.reviewCount})</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <span className="text-xl font-bold text-ds-text">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-ds-muted line-through">{product.originalPrice}</span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-ds-muted mt-3 line-clamp-3">{product.description}</p>
            )}

            <div className="mt-auto pt-4 space-y-2">
              <button
                onClick={() => onAddToCart?.(product.id)}
                disabled={product.inStock === false}
                className="w-full px-4 py-2.5 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.inStock === false
                  ? t(locale, "product.out_of_stock")
                  : t(locale, "product.add_to_cart")}
              </button>
              <button
                onClick={() => onViewFull?.(product.id)}
                className="w-full px-4 py-2.5 text-sm font-medium text-ds-text bg-ds-accent border border-ds-border rounded-md hover:bg-ds-accent/80 transition-colors"
              >
                {t(locale, "blocks.view_details")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
