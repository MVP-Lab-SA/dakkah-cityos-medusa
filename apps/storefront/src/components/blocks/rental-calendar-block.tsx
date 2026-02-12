import React, { useState } from 'react'

interface RentalCalendarBlockProps {
  itemId?: string
  pricingUnit?: 'hourly' | 'daily' | 'weekly' | 'monthly'
  showDeposit?: boolean
  minDuration?: number
}

const pricingRates: Record<string, number> = {
  hourly: 25,
  daily: 150,
  weekly: 900,
  monthly: 3200,
}

export const RentalCalendarBlock: React.FC<RentalCalendarBlockProps> = ({
  itemId,
  pricingUnit = 'daily',
  showDeposit = true,
  minDuration = 1,
}) => {
  const [selectedUnit, setSelectedUnit] = useState(pricingUnit)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const rate = pricingRates[selectedUnit]
  const deposit = Math.round(rate * 2)
  const estimatedDuration = 3
  const subtotal = rate * estimatedDuration
  const total = subtotal + (showDeposit ? deposit : 0)

  const units: Array<'hourly' | 'daily' | 'weekly' | 'monthly'> = ['hourly', 'daily', 'weekly', 'monthly']

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-ds-border">
            <h2 className="text-2xl font-bold text-ds-foreground mb-1">Reserve This Item</h2>
            <p className="text-sm text-ds-muted-foreground">Select your rental period and pricing preference</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-2">Pricing Unit</label>
              <div className="grid grid-cols-4 gap-2">
                {units.map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setSelectedUnit(unit)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedUnit === unit
                        ? 'bg-ds-primary text-ds-primary-foreground'
                        : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
                    }`}
                  >
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-ds-border bg-ds-background text-ds-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-ds-border bg-ds-background text-ds-foreground"
                />
              </div>
            </div>

            {minDuration > 1 && (
              <p className="text-xs text-ds-muted-foreground">
                Minimum rental duration: {minDuration} {selectedUnit === 'hourly' ? 'hours' : selectedUnit === 'daily' ? 'days' : selectedUnit === 'weekly' ? 'weeks' : 'months'}
              </p>
            )}

            <div className="bg-ds-muted rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-ds-muted-foreground">Rate ({selectedUnit})</span>
                <span className="text-ds-foreground font-medium">${rate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ds-muted-foreground">Estimated duration</span>
                <span className="text-ds-foreground font-medium">{estimatedDuration} {selectedUnit === 'hourly' ? 'hours' : selectedUnit === 'daily' ? 'days' : selectedUnit === 'weekly' ? 'weeks' : 'months'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ds-muted-foreground">Subtotal</span>
                <span className="text-ds-foreground font-medium">${subtotal.toLocaleString()}</span>
              </div>
              {showDeposit && (
                <div className="flex justify-between text-sm">
                  <span className="text-ds-muted-foreground">Security Deposit (refundable)</span>
                  <span className="text-ds-foreground font-medium">${deposit.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-ds-border pt-3 flex justify-between">
                <span className="font-semibold text-ds-foreground">Total</span>
                <span className="font-bold text-lg text-ds-foreground">${total.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Reserve Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
