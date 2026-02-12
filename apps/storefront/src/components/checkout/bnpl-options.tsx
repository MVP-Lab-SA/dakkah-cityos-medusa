import React, { useState } from "react"

interface BNPLPlan {
  id: string
  provider: string
  installments: number
  interestRate: number
  label: string
  description: string
}

interface BNPLOptionsProps {
  totalAmount: number
  currency?: string
  plans?: BNPLPlan[]
  onSelect?: (planId: string | null) => void
}

const defaultPlans: BNPLPlan[] = [
  { id: "4x-free", provider: "tabby", installments: 4, interestRate: 0, label: "Pay in 4", description: "4 interest-free payments" },
  { id: "6m", provider: "tamara", installments: 6, interestRate: 0, label: "6 Months", description: "Split into 6 monthly payments" },
  { id: "12m", provider: "tabby", installments: 12, interestRate: 5, label: "12 Months", description: "12 monthly payments at 5% APR" },
]

export function BNPLOptions({
  totalAmount,
  currency = "USD",
  plans = defaultPlans,
  onSelect,
}: BNPLOptionsProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showTerms, setShowTerms] = useState(false)

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount / 100)
  }

  const calculateMonthly = (plan: BNPLPlan) => {
    const principal = totalAmount
    if (plan.interestRate === 0) {
      return principal / plan.installments
    }
    const monthlyRate = plan.interestRate / 100 / 12
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -plan.installments))
    return Math.ceil(payment)
  }

  const handleSelect = (planId: string) => {
    const next = selectedPlan === planId ? null : planId
    setSelectedPlan(next)
    onSelect?.(next)
  }

  const providerLogos: Record<string, string> = {
    tabby: "Tabby",
    tamara: "Tamara",
  }

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-ds-foreground">Buy Now, Pay Later</h3>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(providerLogos).map(([key, name]) => (
            <span
              key={key}
              className="px-2 py-0.5 text-xs font-medium bg-ds-muted rounded text-ds-muted-foreground border border-ds-border"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {plans.map((plan) => {
          const monthly = calculateMonthly(plan)
          const isSelected = selectedPlan === plan.id

          return (
            <label
              key={plan.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? "border-ds-primary bg-ds-primary/5"
                  : "border-ds-border hover:bg-ds-muted"
              }`}
            >
              <input
                type="radio"
                name="bnpl"
                value={plan.id}
                checked={isSelected}
                onChange={() => handleSelect(plan.id)}
                className="w-4 h-4 text-ds-primary border-ds-border focus:ring-ds-primary"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-ds-foreground">{plan.label}</p>
                  {plan.interestRate === 0 && (
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-ds-success/10 text-ds-success rounded">
                      Interest-free
                    </span>
                  )}
                </div>
                <p className="text-xs text-ds-muted-foreground mt-0.5">{plan.description}</p>
                <p className="text-xs text-ds-muted-foreground mt-0.5">
                  via {providerLogos[plan.provider] || plan.provider}
                </p>
              </div>
              <div className="text-end">
                <p className="text-sm font-semibold text-ds-foreground">{formatPrice(monthly)}</p>
                <p className="text-xs text-ds-muted-foreground">/month</p>
              </div>
            </label>
          )
        })}
      </div>

      {selectedPlan && (
        <div className="bg-ds-muted rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-ds-foreground">Payment Breakdown</h4>
          {(() => {
            const plan = plans.find((p) => p.id === selectedPlan)
            if (!plan) return null
            const monthly = calculateMonthly(plan)
            const totalWithInterest = monthly * plan.installments
            return (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-ds-muted-foreground">
                  <span>Order total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-ds-muted-foreground">
                  <span>{plan.installments} payments of</span>
                  <span>{formatPrice(monthly)}</span>
                </div>
                {plan.interestRate > 0 && (
                  <div className="flex justify-between text-xs text-ds-muted-foreground">
                    <span>Interest ({plan.interestRate}% APR)</span>
                    <span>{formatPrice(totalWithInterest - totalAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-medium text-ds-foreground border-t border-ds-border pt-1">
                  <span>Total to pay</span>
                  <span>{formatPrice(totalWithInterest)}</span>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowTerms(!showTerms)}
          className="text-xs text-ds-primary hover:underline"
        >
          {showTerms ? "Hide terms" : "View terms & conditions"}
        </button>
        {showTerms && (
          <div className="mt-2 p-3 bg-ds-muted rounded-md text-xs text-ds-muted-foreground space-y-1">
            <p>Subject to approval. Terms and conditions apply.</p>
            <p>Late fees may apply for missed payments. Interest rates vary by plan.</p>
            <p>Available for orders over {formatPrice(10000)}. Maximum order value {formatPrice(500000)}.</p>
            <p>Payment plans provided by Tabby and Tamara. Refer to provider terms for full details.</p>
          </div>
        )}
      </div>
    </div>
  )
}
