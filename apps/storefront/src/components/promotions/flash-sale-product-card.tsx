import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface FlashSaleProductCardProps {
  locale?: string
  name: string
  image?: string
  originalPrice: number
  salePrice: number
  currency?: string
  totalStock: number
  soldCount: number
  onAddToCart?: () => void
}

export function FlashSaleProductCard({
  locale: localeProp,
  name,
  image,
  originalPrice,
  salePrice,
  currency = "USD",
  totalStock,
  soldCount,
  onAddToCart,
}: FlashSaleProductCardProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  const remaining = totalStock - soldCount
  const soldPercent = totalStock > 0 ? Math.min((soldCount / totalStock) * 100, 100) : 0
  const isSoldOut = remaining <= 0
  const isAlmostGone = remaining > 0 && remaining <= 5

  return (
    <div className="bg-ds-card rounded-lg border border-ds-border overflow-hidden group">
      <div className="relative aspect-square bg-ds-muted">
        {image && (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        )}
        <div className="absolute top-2 start-2">
          <span className="bg-ds-destructive text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercent}% {t(locale, "flashSale.off")}
          </span>
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 bg-ds-background/70 flex items-center justify-center">
            <span className="text-sm font-bold text-ds-destructive bg-ds-destructive/10 px-4 py-2 rounded-full">
              {t(locale, "flashSale.sold_out")}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <h3 className="text-sm font-medium text-ds-foreground line-clamp-2">{name}</h3>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-ds-destructive">
            {formatCurrency(salePrice, currency, locale as SupportedLocale)}
          </span>
          <span className="text-sm text-ds-muted-foreground line-through">
            {formatCurrency(originalPrice, currency, locale as SupportedLocale)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-ds-success bg-ds-success/10 px-2 py-0.5 rounded-full">
            {t(locale, "flashSale.you_save")} {formatCurrency(originalPrice - salePrice, currency, locale as SupportedLocale)}
          </span>
        </div>

        <div className="space-y-1">
          <div className="w-full h-2 bg-ds-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                soldPercent > 80 ? "bg-ds-destructive" : soldPercent > 50 ? "bg-ds-warning" : "bg-ds-success"
              }`}
              style={{ width: `${soldPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-ds-muted-foreground">
            <span>{soldCount} {t(locale, "flashSale.items_sold")}</span>
            {isAlmostGone ? (
              <span className="text-ds-destructive font-medium">
                {t(locale, "flashSale.almost_gone")}
              </span>
            ) : (
              <span>{remaining} {t(locale, "flashSale.remaining")}</span>
            )}
          </div>
        </div>

        {!isSoldOut && onAddToCart && (
          <button
            onClick={onAddToCart}
            className="w-full py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            {t(locale, "flashSale.shop_now")}
          </button>
        )}
      </div>
    </div>
  )
}
