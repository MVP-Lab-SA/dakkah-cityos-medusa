import { Link } from "@tanstack/react-router"
import { formatPrice } from "@/lib/utils/price"

interface CartItem {
  id: string
  title: string
  thumbnail?: string
  quantity: number
  unit_price: number
  variant?: { title?: string }
}

interface CartVendorGroupProps {
  vendorId: string
  vendorName: string
  vendorHandle: string
  items: CartItem[]
  currencyCode: string
  countryCode: string
  onUpdateQuantity?: (itemId: string, quantity: number) => void
  onRemoveItem?: (itemId: string) => void
}

export function CartVendorGroup({
  vendorId,
  vendorName,
  vendorHandle,
  items,
  currencyCode,
  countryCode,
  onUpdateQuantity,
  onRemoveItem,
}: CartVendorGroupProps) {
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {/* Vendor Header */}
      <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50">
        <div className="flex items-center justify-between">
          <Link
            to={`/${countryCode}/vendors/${vendorHandle}` as any}
            className="font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
          >
            {vendorName}
          </Link>
          <span className="text-sm text-zinc-500">{items.length} items</span>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-zinc-100">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-6">
            <div className="w-16 h-16 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-zinc-900 truncate">{item.title}</h4>
              {item.variant?.title && (
                <p className="text-sm text-zinc-500">{item.variant.title}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center border border-zinc-200 rounded-lg">
                  <button
                    onClick={() => onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1 text-zinc-600 hover:bg-zinc-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-zinc-600 hover:bg-zinc-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => onRemoveItem?.(item.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-semibold text-zinc-900">
              {formatPrice(item.unit_price * item.quantity, currencyCode)}
            </p>
          </div>
        ))}
      </div>

      {/* Vendor Subtotal */}
      <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600">Subtotal from {vendorName}</span>
          <span className="font-semibold text-zinc-900">
            {formatPrice(subtotal, currencyCode)}
          </span>
        </div>
      </div>
    </div>
  )
}
