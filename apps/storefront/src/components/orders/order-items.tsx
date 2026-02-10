import { formatPrice } from "@/lib/utils/price"

interface OrderItem {
  id: string
  title: string
  description?: string
  thumbnail?: string
  quantity: number
  unit_price: number
  total: number
  variant?: {
    title?: string
    sku?: string
  }
}

interface OrderItemsProps {
  items: OrderItem[]
  currencyCode: string
}

export function OrderItems({ items, currencyCode }: OrderItemsProps) {
  return (
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">
          Items ({items.length})
        </h3>
      </div>
      <div className="divide-y divide-ds-border">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-6">
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-lg bg-ds-muted overflow-hidden flex-shrink-0">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ds-muted-foreground text-xs">
                  No image
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-ds-foreground truncate">{item.title}</h4>
              {item.variant?.title && (
                <p className="text-sm text-ds-muted-foreground mt-0.5">{item.variant.title}</p>
              )}
              {item.variant?.sku && (
                <p className="text-xs text-ds-muted-foreground mt-0.5">SKU: {item.variant.sku}</p>
              )}
              <p className="text-sm text-ds-muted-foreground mt-2">
                {formatPrice(item.unit_price, currencyCode)} x {item.quantity}
              </p>
            </div>

            {/* Price */}
            <div className="text-end">
              <p className="font-semibold text-ds-foreground">
                {formatPrice(item.total, currencyCode)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
