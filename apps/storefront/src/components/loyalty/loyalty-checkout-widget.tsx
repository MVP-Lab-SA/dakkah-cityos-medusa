import React, { useState, useEffect } from "react"

const LOYALTY_KEY = "dakkah_loyalty_balance"
const POINTS_PER_DOLLAR = 100

interface LoyaltyCheckoutWidgetProps {
  orderTotal?: number
  earnRate?: number
}

function getPointsBalance(): number {
  try {
    const raw = localStorage.getItem(LOYALTY_KEY)
    return raw ? parseInt(raw, 10) : 0
  } catch {
    return 0
  }
}

export function LoyaltyCheckoutWidget({
  orderTotal = 0,
  earnRate = 10,
}: LoyaltyCheckoutWidgetProps) {
  const [pointsBalance, setPointsBalance] = useState(0)
  const [usePoints, setUsePoints] = useState(false)
  const [pointsToUse, setPointsToUse] = useState(0)

  useEffect(() => {
    setPointsBalance(getPointsBalance())
  }, [])

  const maxPointsUsable = Math.min(
    pointsBalance,
    Math.floor(orderTotal * POINTS_PER_DOLLAR)
  )
  const discountAmount = pointsToUse / POINTS_PER_DOLLAR
  const pointsToEarn = Math.floor(
    (orderTotal - (usePoints ? discountAmount : 0)) * earnRate
  )

  const handleToggle = () => {
    if (!usePoints) {
      setPointsToUse(maxPointsUsable)
      setUsePoints(true)
    } else {
      setPointsToUse(0)
      setUsePoints(false)
    }
  }

  const handlePointsChange = (value: string) => {
    const num = parseInt(value, 10) || 0
    setPointsToUse(Math.min(Math.max(0, num), maxPointsUsable))
  }

  if (pointsBalance === 0 && orderTotal === 0) {
    return null
  }

  return (
    <div className="bg-ds-card rounded-xl border border-ds-border overflow-hidden">
      <div className="px-5 py-4 bg-ds-primary/5 border-b border-ds-border">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-ds-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h3 className="text-sm font-semibold text-ds-foreground">
            Loyalty Points
          </h3>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ds-muted-foreground">
            Available Balance
          </span>
          <span className="text-lg font-bold text-ds-foreground">
            {pointsBalance.toLocaleString()} pts
          </span>
        </div>

        {pointsBalance > 0 && orderTotal > 0 && (
          <>
            <div className="flex items-center justify-between p-3 bg-ds-muted rounded-lg">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    usePoints ? "bg-ds-primary" : "bg-ds-border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      usePoints ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-ds-foreground">
                  Use Points
                </span>
              </div>
              {usePoints && (
                <span className="text-sm font-medium text-ds-primary">
                  -${discountAmount.toFixed(2)}
                </span>
              )}
            </div>

            {usePoints && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-ds-muted-foreground">
                    Points to use:
                  </label>
                  <input
                    type="number"
                    value={pointsToUse}
                    onChange={(e) => handlePointsChange(e.target.value)}
                    min={0}
                    max={maxPointsUsable}
                    className="w-24 px-2 py-1 text-sm text-right rounded border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary"
                  />
                  <span className="text-xs text-ds-muted-foreground">
                    / {maxPointsUsable.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-ds-muted-foreground">
                  {POINTS_PER_DOLLAR} points = $1.00
                </p>
              </div>
            )}
          </>
        )}

        <div className="pt-3 border-t border-ds-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ds-muted-foreground">
              Points earned from this purchase
            </span>
            <span className="text-sm font-semibold text-green-600">
              +{pointsToEarn.toLocaleString()} pts
            </span>
          </div>
          <p className="text-xs text-ds-muted-foreground mt-1">
            Earn {earnRate} points per $1 spent
          </p>
        </div>
      </div>
    </div>
  )
}
