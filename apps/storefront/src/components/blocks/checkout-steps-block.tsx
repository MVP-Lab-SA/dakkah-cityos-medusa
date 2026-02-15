import React from 'react'

interface CheckoutStepsBlockProps {
  steps?: string[]
  variant?: 'horizontal' | 'vertical'
  showOrderSummary?: boolean
}

export const CheckoutStepsBlock: React.FC<CheckoutStepsBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  steps = ['Shipping', 'Payment', 'Review'],
  variant = 'horizontal',
  showOrderSummary = true,
}) => {
  const [activeStep, setActiveStep] = React.useState(0)

  const isHorizontal = variant === 'horizontal'

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-8">Checkout</h2>

        <div className={`mb-8 ${isHorizontal ? '' : 'max-w-xs'}`}>
          <div className={`flex ${isHorizontal ? 'items-center justify-between' : 'flex-col gap-4'}`}>
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className={`flex items-center gap-3 ${isHorizontal ? '' : ''}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                      index < activeStep
                        ? 'bg-ds-primary text-ds-primary-foreground'
                        : index === activeStep
                        ? 'bg-ds-primary text-ds-primary-foreground ring-4 ring-ds-primary/20'
                        : 'bg-ds-muted text-ds-muted-foreground'
                    }`}
                  >
                    {index < activeStep ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      index <= activeStep ? 'text-ds-foreground' : 'text-ds-muted-foreground'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {isHorizontal && index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${index < activeStep ? 'bg-ds-primary' : 'bg-ds-muted'}`} />
                )}
                {!isHorizontal && index < steps.length - 1 && (
                  <div className={`ms-4 w-0.5 h-8 ${index < activeStep ? 'bg-ds-primary' : 'bg-ds-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={showOrderSummary ? 'grid grid-cols-1 lg:grid-cols-3 gap-8' : ''}>
          <div className={showOrderSummary ? 'lg:col-span-2' : ''}>
            <div className="bg-ds-card border border-ds-border rounded-lg p-6">
              {activeStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-ds-foreground mb-4">Shipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['First Name', 'Last Name', 'Address', 'City', 'State', 'ZIP Code'].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-ds-foreground mb-1">{field}</label>
                        <input
                          type="text"
                          placeholder={field}
                          className="w-full px-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-ds-foreground mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {['Credit Card', 'PayPal', 'Bank Transfer'].map((method) => (
                      <label key={method} className="flex items-center gap-3 p-4 border border-ds-border rounded-lg cursor-pointer hover:bg-ds-muted transition-colors">
                        <input type="radio" name="payment" className="w-4 h-4 accent-ds-primary" />
                        <span className="text-sm font-medium text-ds-foreground">{method}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 space-y-4">
                    {['Card Number', 'Expiry Date', 'CVV'].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-ds-foreground mb-1">{field}</label>
                        <input
                          type="text"
                          placeholder={field}
                          className="w-full px-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-ds-foreground mb-4">Review Your Order</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-ds-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium text-ds-foreground mb-2">Shipping Address</h4>
                      <div className="h-4 bg-ds-muted rounded w-3/4 mb-1" />
                      <div className="h-4 bg-ds-muted rounded w-1/2" />
                    </div>
                    <div className="p-4 bg-ds-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium text-ds-foreground mb-2">Payment Method</h4>
                      <div className="h-4 bg-ds-muted rounded w-1/2" />
                    </div>
                    <div className="p-4 bg-ds-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium text-ds-foreground mb-2">Items (3)</h4>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 py-2 border-b border-ds-border last:border-0">
                          <div className="w-10 h-10 bg-ds-muted rounded" />
                          <div className="flex-1">
                            <div className="h-3 bg-ds-muted rounded w-3/4" />
                          </div>
                          <div className="h-3 bg-ds-muted rounded w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeStep === 0
                      ? 'text-ds-muted-foreground cursor-not-allowed'
                      : 'border border-ds-border text-ds-foreground hover:bg-ds-muted'
                  }`}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                  className="px-6 py-2.5 rounded-lg bg-ds-primary text-ds-primary-foreground text-sm font-semibold hover:bg-ds-primary/90 transition-colors"
                >
                  {activeStep === steps.length - 1 ? 'Place Order' : 'Continue'}
                </button>
              </div>
            </div>
          </div>

          {showOrderSummary && (
            <div>
              <div className="bg-ds-card border border-ds-border rounded-lg p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-ds-foreground mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-ds-muted rounded flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-3 bg-ds-muted rounded w-3/4 mb-1" />
                        <div className="h-3 bg-ds-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-ds-border pt-3 space-y-2">
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
                  <div className="border-t border-ds-border pt-2 flex justify-between">
                    <span className="font-semibold text-ds-foreground">Total</span>
                    <span className="font-bold text-ds-foreground">$236.75</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
