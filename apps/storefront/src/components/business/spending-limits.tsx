import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils/price"

interface SpendingLimit {
  type: "daily" | "weekly" | "monthly" | "per_order"
  limit: number
  spent: number
}

interface SpendingLimitsProps {
  limits: SpendingLimit[]
  currencyCode: string
  canRequest?: boolean
  onRequestIncrease?: (type: SpendingLimit["type"], requestedAmount: number, reason: string) => Promise<void>
}

export function SpendingLimits({
  limits,
  currencyCode,
  canRequest = false,
  onRequestIncrease,
}: SpendingLimitsProps) {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [selectedLimit, setSelectedLimit] = useState<SpendingLimit["type"] | null>(null)
  const [requestedAmount, setRequestedAmount] = useState("")
  const [reason, setReason] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)

  const typeLabels: Record<SpendingLimit["type"], string> = {
    daily: "Daily Limit",
    weekly: "Weekly Limit",
    monthly: "Monthly Limit",
    per_order: "Per Order Limit",
  }

  const handleRequestIncrease = async () => {
    if (!selectedLimit || !requestedAmount || !onRequestIncrease) return
    setIsRequesting(true)
    try {
      await onRequestIncrease(selectedLimit, parseFloat(requestedAmount), reason)
      setShowRequestForm(false)
      setSelectedLimit(null)
      setRequestedAmount("")
      setReason("")
    } finally {
      setIsRequesting(false)
    }
  }

  const openRequestForm = (type: SpendingLimit["type"]) => {
    setSelectedLimit(type)
    setShowRequestForm(true)
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">Spending Limits</h3>
      </div>

      <div className="divide-y divide-ds-border">
        {limits.map((limit) => {
          const percentage = (limit.spent / limit.limit) * 100
          const isNearLimit = percentage >= 80
          const isOverLimit = percentage >= 100

          return (
            <div key={limit.type} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-ds-foreground">{typeLabels[limit.type]}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-ds-muted-foreground">
                    {formatPrice(limit.spent, currencyCode)} of {formatPrice(limit.limit, currencyCode)}
                  </span>
                  {canRequest && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openRequestForm(limit.type)}
                    >
                      Request Increase
                    </Button>
                  )}
                </div>
              </div>
              <div className="h-2 bg-ds-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOverLimit
                      ? "bg-ds-destructive"
                      : isNearLimit
                      ? "bg-ds-warning"
                      : "bg-ds-success"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              {isNearLimit && !isOverLimit && (
                <p className="text-xs text-ds-warning mt-2">
                  You're approaching your {typeLabels[limit.type].toLowerCase()}
                </p>
              )}
              {isOverLimit && (
                <p className="text-xs text-ds-destructive mt-2">
                  You've exceeded your {typeLabels[limit.type].toLowerCase()}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Request Form Modal */}
      {showRequestForm && selectedLimit && (
        <div className="p-6 border-t border-ds-border bg-ds-muted">
          <h4 className="font-medium text-ds-foreground mb-4">
            Request {typeLabels[selectedLimit]} Increase
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">
                Requested Amount
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">
                Reason for Request
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you need a higher limit..."
                rows={3}
                className="w-full rounded-lg border border-ds-border px-3 py-2 text-sm resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowRequestForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleRequestIncrease} disabled={!requestedAmount || isRequesting}>
                {isRequesting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
