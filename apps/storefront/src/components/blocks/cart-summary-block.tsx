import React from 'react'

interface CartSummaryBlockProps {
  variant?: 'mini' | 'full' | 'sidebar'
  showCoupon?: boolean
  showEstimatedShipping?: boolean
}

export const CartSummaryBlock: React.FC<CartSummaryBlockProps> = ({
  variant = 'full',
  showCoupon = true,
  showEstimatedShipping = true,
}) => {
  const [couponCode, setCouponCode] = React.useState('')

  const placeholderItems = [
    { id: 1, name: 'Product One', price: 49.99, quantity: 2 },
    { id: 2, name: 'Product Two', price: 29.99, quantity: 1 },
    { id: 3, name: 'Product Three', price: 79.99, quantity: 1 },
  ]

  const subtotal = placeholderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (variant === 'mini') {
    return (
      <section className="py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-ds-card border border-ds-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-ds-foreground">Cart ({placeholderItems.length} items)</span>
              <span className="text-sm font-bold text-ds-foreground">${total.toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="w-full py-2 rounded-lg bg-ds-primary text-ds-primary-foreground text-sm font-semibold hover:bg-ds-primary/90 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      </section>
    )
  }

  const isSidebar = variant === 'sidebar'

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-8">Shopping Cart</h2>

        <div className={isSidebar ? 'grid grid-cols-1 lg:grid-cols-3 gap-8' : ''}>
          <div className={isSidebar ? 'lg:col-span-2' : ''}>
            <div className="space-y-4">
              {placeholderItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-ds-card border border-ds-border rounded-lg">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-ds-muted rounded-md flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-medium text-ds-foreground truncate">{item.name}</h3>
                    <p className="text-sm text-ds-muted-foreground mt-1">Variant: Default</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button type="button" className="w-8 h-8 rounded border border-ds-border text-ds-foreground hover:bg-ds-muted flex items-center justify-center text-sm">−</button>
                        <span className="w-8 text-center text-sm text-ds-foreground">{item.quantity}</span>
                        <button type="button" className="w-8 h-8 rounded border border-ds-border text-ds-foreground hover:bg-ds-muted flex items-center justify-center text-sm">+</button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-ds-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                        <button type="button" className="text-ds-muted-foreground hover:text-ds-destructive transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={isSidebar ? '' : 'mt-8 max-w-md ml-auto'}>
            <div className="bg-ds-card border border-ds-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-ds-foreground mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-ds-muted-foreground">Subtotal</span>
                  <span className="text-ds-foreground">${subtotal.toFixed(2)}</span>
                </div>
                {showEstimatedShipping && (
                  <div className="flex justify-between text-sm">
                    <span className="text-ds-muted-foreground">Estimated Shipping</span>
                    <span className="text-ds-foreground">${shipping.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-ds-muted-foreground">Tax</span>
                  <span className="text-ds-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-ds-border pt-3 flex justify-between">
                  <span className="font-semibold text-ds-foreground">Total</span>
                  <span className="font-bold text-lg text-ds-foreground">${total.toFixed(2)}</span>
                </div>
              </div>

              {showCoupon && (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 text-sm rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 text-sm rounded-md border border-ds-border text-ds-foreground hover:bg-ds-muted transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="w-full py-3 rounded-lg bg-ds-primary text-ds-primary-foreground font-semibold hover:bg-ds-primary/90 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
