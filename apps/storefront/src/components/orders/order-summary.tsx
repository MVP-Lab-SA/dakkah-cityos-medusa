import { formatPrice } from "@/lib/utils/price"

interface OrderSummaryProps {
  subtotal: number
  shippingTotal: number
  taxTotal: number
  discountTotal?: number
  total: number
  currencyCode: string
  shippingMethod?: string
  paymentMethod?: string
}

export function OrderSummary({
  subtotal,
  shippingTotal,
  taxTotal,
  discountTotal,
  total,
  currencyCode,
  shippingMethod,
  paymentMethod,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Subtotal</span>
          <span className="text-zinc-900">{formatPrice(subtotal, currencyCode)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Shipping</span>
          <span className="text-zinc-900">
            {shippingTotal === 0 ? "Free" : formatPrice(shippingTotal, currencyCode)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Tax</span>
          <span className="text-zinc-900">{formatPrice(taxTotal, currencyCode)}</span>
        </div>
        
        {discountTotal && discountTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount</span>
            <span className="text-green-600">-{formatPrice(discountTotal, currencyCode)}</span>
          </div>
        )}
        
        <div className="pt-3 border-t border-zinc-200">
          <div className="flex justify-between">
            <span className="font-semibold text-zinc-900">Total</span>
            <span className="font-semibold text-zinc-900">
              {formatPrice(total, currencyCode)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment & Shipping Info */}
      {(shippingMethod || paymentMethod) && (
        <div className="mt-6 pt-4 border-t border-zinc-200 space-y-3">
          {shippingMethod && (
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Shipping Method</p>
              <p className="text-sm text-zinc-900 mt-1">{shippingMethod}</p>
            </div>
          )}
          {paymentMethod && (
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Payment Method</p>
              <p className="text-sm text-zinc-900 mt-1">{paymentMethod}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
