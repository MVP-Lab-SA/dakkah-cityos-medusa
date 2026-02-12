import React from 'react'

interface OrderConfirmationBlockProps {
  showTracking?: boolean
  showRecommendations?: boolean
  thankYouMessage?: string
}

export const OrderConfirmationBlock: React.FC<OrderConfirmationBlockProps> = ({
  showTracking = true,
  showRecommendations = true,
  thankYouMessage = 'Thank you for your order!',
}) => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ds-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-2">{thankYouMessage}</h1>
          <p className="text-ds-muted-foreground">Your order has been placed successfully.</p>
          <p className="text-sm text-ds-muted-foreground mt-1">
            Order Number: <span className="font-semibold text-ds-foreground">#ORD-2024-00847</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-ds-card border border-ds-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-ds-foreground mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {[
                { name: 'Product One', qty: 2, price: 49.99 },
                { name: 'Product Two', qty: 1, price: 29.99 },
                { name: 'Product Three', qty: 1, price: 79.99 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-ds-border last:border-0">
                  <div className="w-12 h-12 bg-ds-muted rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ds-foreground truncate">{item.name}</p>
                    <p className="text-xs text-ds-muted-foreground">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-medium text-ds-foreground">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-ds-border mt-3 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-ds-muted-foreground">Subtotal</span>
                <span className="text-ds-foreground">$209.96</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ds-muted-foreground">Shipping</span>
                <span className="text-ds-foreground">$9.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ds-muted-foreground">Tax</span>
                <span className="text-ds-foreground">$16.80</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-ds-border">
                <span className="text-ds-foreground">Total</span>
                <span className="text-ds-foreground">$236.75</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-ds-card border border-ds-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-ds-foreground mb-4">Shipping Information</h3>
              <div className="space-y-1 text-sm">
                <p className="text-ds-foreground font-medium">John Doe</p>
                <p className="text-ds-muted-foreground">123 Main Street</p>
                <p className="text-ds-muted-foreground">New York, NY 10001</p>
                <p className="text-ds-muted-foreground">United States</p>
              </div>
              <div className="mt-4 pt-4 border-t border-ds-border">
                <p className="text-sm text-ds-muted-foreground">Estimated Delivery</p>
                <p className="text-sm font-medium text-ds-foreground">Feb 18 - Feb 22, 2026</p>
              </div>
            </div>

            {showTracking && (
              <div className="bg-ds-card border border-ds-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-ds-foreground mb-4">Order Tracking</h3>
                <div className="space-y-4">
                  {[
                    { status: 'Order Placed', date: 'Feb 12, 2026', active: true },
                    { status: 'Processing', date: '', active: false },
                    { status: 'Shipped', date: '', active: false },
                    { status: 'Delivered', date: '', active: false },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${step.active ? 'bg-ds-primary' : 'bg-ds-muted'}`} />
                        {i < 3 && <div className={`w-0.5 h-8 ${step.active ? 'bg-ds-primary' : 'bg-ds-muted'}`} />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${step.active ? 'text-ds-foreground' : 'text-ds-muted-foreground'}`}>
                          {step.status}
                        </p>
                        {step.date && (
                          <p className="text-xs text-ds-muted-foreground">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showRecommendations && (
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-ds-foreground mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-ds-muted aspect-square rounded-lg mb-4" />
                  <div className="h-4 bg-ds-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-ds-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
