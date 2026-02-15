import React, { useState } from 'react'

interface BulkPricingTableBlockProps {
  heading?: string
  productId?: string
  showSavings?: boolean
  highlightBestValue?: boolean
  variant?: 'table' | 'cards' | 'steps'
}

const pricingTiers = [
  { min: 1, max: 9, unitPrice: 49.99, label: '1–9' },
  { min: 10, max: 24, unitPrice: 44.99, label: '10–24' },
  { min: 25, max: 49, unitPrice: 39.99, label: '25–49' },
  { min: 50, max: 99, unitPrice: 34.99, label: '50–99' },
  { min: 100, max: 249, unitPrice: 29.99, label: '100–249' },
  { min: 250, max: null, unitPrice: 24.99, label: '250+' },
]

const basePrice = 49.99
const bestValueIndex = 4

export const BulkPricingTableBlock: React.FC<BulkPricingTableBlockProps> = ({
  heading = 'Bulk Pricing',
  showSavings = true,
  highlightBestValue = true,
  variant = 'table',
}) => {
  const [quantity, setQuantity] = useState(1)

  const getSavings = (unitPrice: number) => {
    return Math.round(((basePrice - unitPrice) / basePrice) * 100)
  }

  const getCurrentTier = () => {
    return pricingTiers.find((t) =>
      t.max ? quantity >= t.min && quantity <= t.max : quantity >= t.min
    )
  }

  const currentTier = getCurrentTier()
  const maxBarPrice = basePrice

  if (variant === 'cards') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground text-center mb-8">
            {heading}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {pricingTiers.map((tier, idx) => {
              const isBest = highlightBestValue && idx === bestValueIndex
              return (
                <div
                  key={idx}
                  className={`relative rounded-lg border p-4 text-center transition-shadow ${
                    isBest
                      ? 'border-ds-primary bg-ds-primary/5 shadow-md'
                      : 'border-ds-border bg-ds-card hover:shadow-sm'
                  }`}
                >
                  {isBest && (
                    <span className="absolute -top-2.5 start-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-ds-primary text-ds-primary-foreground">
                      Best Value
                    </span>
                  )}
                  <p className="text-xs text-ds-muted-foreground mb-1">Qty</p>
                  <p className="text-sm font-semibold text-ds-foreground mb-2">{tier.label}</p>
                  <p className="text-xl font-bold text-ds-foreground">${tier.unitPrice}</p>
                  <p className="text-xs text-ds-muted-foreground">per unit</p>
                  {showSavings && getSavings(tier.unitPrice) > 0 && (
                    <p className="mt-2 text-xs font-medium text-ds-success">
                      Save {getSavings(tier.unitPrice)}%
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-ds-foreground">Quantity:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 text-sm text-center rounded-md border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
            </div>
            {currentTier && (
              <p className="text-sm text-ds-muted-foreground">
                Unit price: <span className="font-semibold text-ds-foreground">${currentTier.unitPrice}</span>
                {' · '}Total: <span className="font-semibold text-ds-foreground">${(quantity * currentTier.unitPrice).toFixed(2)}</span>
              </p>
            )}
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg bg-ds-primary text-ds-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'steps') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground text-center mb-8">
            {heading}
          </h2>
          <div className="max-w-2xl mx-auto space-y-3 mb-8">
            {pricingTiers.map((tier, idx) => {
              const isBest = highlightBestValue && idx === bestValueIndex
              const barWidth = ((tier.unitPrice / maxBarPrice) * 100)
              return (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-ds-foreground w-16 text-end shrink-0">{tier.label}</span>
                  <div className="flex-1 relative">
                    <div className="w-full h-8 bg-ds-muted rounded-md overflow-hidden">
                      <div
                        className={`h-full rounded-md transition-all flex items-center justify-end pe-2 ${
                          isBest ? 'bg-ds-primary' : 'bg-ds-primary/60'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      >
                        <span className={`text-xs font-semibold ${isBest ? 'text-ds-primary-foreground' : 'text-ds-primary-foreground/80'}`}>
                          ${tier.unitPrice}
                        </span>
                      </div>
                    </div>
                    {isBest && (
                      <span className="absolute -top-1 -end-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-ds-primary text-ds-primary-foreground">
                        Best
                      </span>
                    )}
                  </div>
                  {showSavings && (
                    <span className="text-xs font-medium text-ds-success w-14 shrink-0">
                      {getSavings(tier.unitPrice) > 0 ? `−${getSavings(tier.unitPrice)}%` : '—'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-ds-foreground">Quantity:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 text-sm text-center rounded-md border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
            </div>
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg bg-ds-primary text-ds-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground text-center mb-8">
          {heading}
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="border border-ds-border rounded-lg overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-ds-muted">
                  <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">Quantity</th>
                  <th className="text-end text-xs font-medium text-ds-muted-foreground p-3">Unit Price</th>
                  <th className="text-end text-xs font-medium text-ds-muted-foreground p-3">Total (max qty)</th>
                  {showSavings && (
                    <th className="text-end text-xs font-medium text-ds-muted-foreground p-3">Savings</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {pricingTiers.map((tier, idx) => {
                  const isBest = highlightBestValue && idx === bestValueIndex
                  const maxQty = tier.max || tier.min
                  return (
                    <tr
                      key={idx}
                      className={`border-t border-ds-border ${
                        isBest ? 'bg-ds-primary/5' : 'bg-ds-background'
                      }`}
                    >
                      <td className="p-3 text-sm text-ds-foreground">
                        <span className="flex items-center gap-2">
                          {tier.label}
                          {isBest && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-ds-primary text-ds-primary-foreground">
                              Best Value
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-end font-medium text-ds-foreground">
                        ${tier.unitPrice}
                      </td>
                      <td className="p-3 text-sm text-end text-ds-muted-foreground">
                        ${(maxQty * tier.unitPrice).toFixed(2)}
                      </td>
                      {showSavings && (
                        <td className="p-3 text-sm text-end">
                          {getSavings(tier.unitPrice) > 0 ? (
                            <span className="text-ds-success font-medium">{getSavings(tier.unitPrice)}%</span>
                          ) : (
                            <span className="text-ds-muted-foreground">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center border border-ds-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 bg-ds-muted text-ds-foreground hover:bg-ds-muted/80 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 px-2 py-2 text-sm text-center bg-ds-background text-ds-foreground focus:outline-none border-x border-ds-border"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 bg-ds-muted text-ds-foreground hover:bg-ds-muted/80 transition-colors"
              >
                +
              </button>
            </div>
            {currentTier && (
              <p className="text-sm text-ds-muted-foreground">
                ${currentTier.unitPrice}/unit · <span className="font-semibold text-ds-foreground">${(quantity * currentTier.unitPrice).toFixed(2)} total</span>
              </p>
            )}
            <button
              type="button"
              className="px-8 py-2.5 rounded-lg bg-ds-primary text-ds-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
