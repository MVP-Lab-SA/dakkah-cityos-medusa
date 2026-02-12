import React, { useState } from "react"

interface CartItem {
  id: string
  title: string
  variant_title?: string
  quantity: number
  unit_price: number
  thumbnail?: string
  vendor_id?: string
  vendor_name?: string
}

interface ShippingOption {
  id: string
  label: string
  price: number
  estimated_days: string
}

interface MultiVendorCartProps {
  items: CartItem[]
  currency?: string
  shippingOptions?: ShippingOption[]
  onShippingSelect?: (vendorId: string, optionId: string) => void
}

export function MultiVendorCart({
  items,
  currency = "USD",
  shippingOptions = [
    { id: "standard", label: "Standard Shipping", price: 5.99, estimated_days: "5-7 days" },
    { id: "express", label: "Express Shipping", price: 12.99, estimated_days: "2-3 days" },
    { id: "overnight", label: "Overnight", price: 24.99, estimated_days: "1 day" },
  ],
  onShippingSelect,
}: MultiVendorCartProps) {
  const grouped = items.reduce<Record<string, { vendorName: string; items: CartItem[] }>>((acc, item) => {
    const vendorId = item.vendor_id || "default"
    if (!acc[vendorId]) {
      acc[vendorId] = { vendorName: item.vendor_name || "Marketplace", items: [] }
    }
    acc[vendorId].items.push(item)
    return acc
  }, {})

  const vendorIds = Object.keys(grouped)
  const [selectedShipping, setSelectedShipping] = useState<Record<string, string>>({})

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount / 100)
  }

  const getVendorSubtotal = (vendorItems: CartItem[]) => {
    return vendorItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  }

  const getShippingCost = (vendorId: string) => {
    const optionId = selectedShipping[vendorId]
    const option = shippingOptions.find((o) => o.id === optionId)
    return option ? option.price * 100 : 0
  }

  const overallSubtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  const overallShipping = vendorIds.reduce((sum, vid) => sum + getShippingCost(vid), 0)
  const overallTotal = overallSubtotal + overallShipping

  const handleShippingChange = (vendorId: string, optionId: string) => {
    setSelectedShipping((prev) => ({ ...prev, [vendorId]: optionId }))
    onShippingSelect?.(vendorId, optionId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <svg className="w-5 h-5 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span className="text-sm font-medium text-ds-foreground">
          Items from {vendorIds.length} vendor{vendorIds.length !== 1 ? "s" : ""}
        </span>
      </div>

      {vendorIds.map((vendorId) => {
        const { vendorName, items: vendorItems } = grouped[vendorId]
        const subtotal = getVendorSubtotal(vendorItems)

        return (
          <div key={vendorId} className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
            <div className="bg-ds-muted px-4 py-3 border-b border-ds-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-ds-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-ds-primary">
                    {vendorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ds-foreground">{vendorName}</p>
                  <p className="text-xs text-ds-muted-foreground">
                    {vendorItems.length} item{vendorItems.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-ds-foreground">{formatPrice(subtotal)}</span>
            </div>

            <div className="divide-y divide-ds-border">
              {vendorItems.map((item) => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-12 rounded-md object-cover border border-ds-border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-ds-muted flex items-center justify-center">
                      <svg className="w-6 h-6 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ds-foreground truncate">{item.title}</p>
                    {item.variant_title && (
                      <p className="text-xs text-ds-muted-foreground">{item.variant_title}</p>
                    )}
                    <p className="text-xs text-ds-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-ds-foreground">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-ds-border bg-ds-muted/50">
              <p className="text-xs font-medium text-ds-muted-foreground mb-2">Shipping for {vendorName}</p>
              <div className="space-y-2">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-ds-muted transition-colors"
                  >
                    <input
                      type="radio"
                      name={`shipping-${vendorId}`}
                      value={option.id}
                      checked={selectedShipping[vendorId] === option.id}
                      onChange={() => handleShippingChange(vendorId, option.id)}
                      className="w-4 h-4 text-ds-primary border-ds-border focus:ring-ds-primary"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-ds-foreground">{option.label}</p>
                      <p className="text-xs text-ds-muted-foreground">{option.estimated_days}</p>
                    </div>
                    <span className="text-sm font-medium text-ds-foreground">
                      {new Intl.NumberFormat("en", { style: "currency", currency }).format(option.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      <div className="bg-ds-card border border-ds-border rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm text-ds-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPrice(overallSubtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-ds-muted-foreground">
          <span>Shipping</span>
          <span>{overallShipping > 0 ? formatPrice(overallShipping) : "Select shipping"}</span>
        </div>
        <div className="border-t border-ds-border pt-2 flex justify-between text-base font-semibold text-ds-foreground">
          <span>Total</span>
          <span>{formatPrice(overallTotal)}</span>
        </div>
      </div>
    </div>
  )
}
