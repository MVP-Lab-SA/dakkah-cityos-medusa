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
    <div className="bg-ds-background rounded-xl border border-ds-border p-6">
      <h3 className="text-lg font-semibold text-ds-foreground mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-ds-muted-foreground">Subtotal</span>
          <span className="text-ds-foreground">{formatPrice(subtotal, currencyCode)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-ds-muted-foreground">Shipping</span>
          <span className="text-ds-foreground">
            {shippingTotal === 0 ? "Free" : formatPrice(shippingTotal, currencyCode)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-ds-muted-foreground">Tax</span>
          <span className="text-ds-foreground">{formatPrice(taxTotal, currencyCode)}</span>
        </div>
        
        {discountTotal && discountTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-ds-success">Discount</span>
            <span className="text-ds-success">-{formatPrice(discountTotal, currencyCode)}</span>
          </div>
        )}
        
        <div className="pt-3 border-t border-ds-border">
          <div className="flex justify-between">
            <span className="font-semibold text-ds-foreground">Total</span>
            <span className="font-semibold text-ds-foreground">
              {formatPrice(total, currencyCode)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment & Shipping Info */}
      {(shippingMethod || paymentMethod) && (
        <div className="mt-6 pt-4 border-t border-ds-border space-y-3">
          {shippingMethod && (
            <div>
              <p className="text-xs text-ds-muted-foreground uppercase tracking-wider">Shipping Method</p>
              <p className="text-sm text-ds-foreground mt-1">{shippingMethod}</p>
            </div>
          )}
          {paymentMethod && (
            <div>
              <p className="text-xs text-ds-muted-foreground uppercase tracking-wider">Payment Method</p>
              <p className="text-sm text-ds-foreground mt-1">{paymentMethod}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
