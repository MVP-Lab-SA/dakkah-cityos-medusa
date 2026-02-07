import { formatPrice } from "@/lib/utils/price"

interface VendorSummary {
  vendorId: string
  vendorName: string
  subtotal: number
  shippingCost: number
}

interface MultiVendorSummaryProps {
  vendors: VendorSummary[]
  currencyCode: string
  taxTotal?: number
  discountTotal?: number
}

export function MultiVendorSummary({
  vendors,
  currencyCode,
  taxTotal = 0,
  discountTotal = 0,
}: MultiVendorSummaryProps) {
  const subtotal = vendors.reduce((sum, v) => sum + v.subtotal, 0)
  const shippingTotal = vendors.reduce((sum, v) => sum + v.shippingCost, 0)
  const total = subtotal + shippingTotal + taxTotal - discountTotal

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200">
        <h3 className="text-lg font-semibold text-zinc-900">Order Summary</h3>
      </div>

      <div className="p-6 space-y-4">
        {/* Per-Vendor Breakdown */}
        {vendors.map((vendor) => (
          <div key={vendor.vendorId} className="text-sm">
            <p className="font-medium text-zinc-900 mb-1">{vendor.vendorName}</p>
            <div className="space-y-1 text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(vendor.subtotal, currencyCode)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {vendor.shippingCost === 0
                    ? "Free"
                    : formatPrice(vendor.shippingCost, currencyCode)}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="border-t border-zinc-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="text-zinc-900">{formatPrice(subtotal, currencyCode)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Shipping ({vendors.length} sellers)</span>
            <span className="text-zinc-900">
              {shippingTotal === 0 ? "Free" : formatPrice(shippingTotal, currencyCode)}
            </span>
          </div>
          {taxTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Tax</span>
              <span className="text-zinc-900">{formatPrice(taxTotal, currencyCode)}</span>
            </div>
          )}
          {discountTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Discount</span>
              <span className="text-green-600">-{formatPrice(discountTotal, currencyCode)}</span>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 pt-4">
          <div className="flex justify-between">
            <span className="font-semibold text-zinc-900">Total</span>
            <span className="font-semibold text-zinc-900">
              {formatPrice(total, currencyCode)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
