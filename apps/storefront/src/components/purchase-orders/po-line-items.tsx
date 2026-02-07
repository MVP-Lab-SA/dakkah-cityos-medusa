import { PurchaseOrderLineItem } from "@/lib/hooks/use-purchase-orders"
import { formatPrice } from "@/lib/utils/price"

interface POLineItemsProps {
  items: PurchaseOrderLineItem[]
  currencyCode: string
  editable?: boolean
  onUpdateQuantity?: (itemId: string, quantity: number) => void
  onRemoveItem?: (itemId: string) => void
}

export function POLineItems({
  items,
  currencyCode,
  editable = false,
  onUpdateQuantity,
  onRemoveItem,
}: POLineItemsProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
        <p className="text-zinc-500">No items in this purchase order</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200">
        <h3 className="text-lg font-semibold text-zinc-900">
          Line Items ({items.length})
        </h3>
      </div>

      <div className="divide-y divide-zinc-100">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-6">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-zinc-900">{item.product_title}</h4>
              {item.variant_title && (
                <p className="text-sm text-zinc-500">{item.variant_title}</p>
              )}
              <p className="text-sm text-zinc-600 mt-1">
                {formatPrice(item.unit_price, currencyCode)} each
              </p>
            </div>

            <div className="flex items-center gap-6">
              {editable ? (
                <div className="flex items-center border border-zinc-200 rounded-lg">
                  <button
                    onClick={() =>
                      onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="px-3 py-1 text-zinc-600 hover:bg-zinc-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-zinc-600 hover:bg-zinc-100"
                  >
                    +
                  </button>
                </div>
              ) : (
                <span className="text-sm text-zinc-600">Qty: {item.quantity}</span>
              )}

              <div className="text-right min-w-[100px]">
                <p className="font-semibold text-zinc-900">
                  {formatPrice(item.total, currencyCode)}
                </p>
              </div>

              {editable && onRemoveItem && (
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200">
        <div className="flex justify-between">
          <span className="font-medium text-zinc-900">Items Total</span>
          <span className="font-semibold text-zinc-900">
            {formatPrice(
              items.reduce((sum, item) => sum + item.total, 0),
              currencyCode
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
