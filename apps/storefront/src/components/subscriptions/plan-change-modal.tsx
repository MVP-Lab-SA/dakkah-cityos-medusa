import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "@medusajs/icons"
import { formatPrice } from "@/lib/utils/price"
import { cn } from "@/lib/utils/cn"

interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency_code: string
  billing_interval: string
  features: string[]
}

interface PlanChangeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlanId: string
  plans: Plan[]
  onChangePlan?: (planId: string) => Promise<void>
}

export function PlanChangeModal({
  open,
  onOpenChange,
  currentPlanId,
  plans,
  onChangePlan,
}: PlanChangeModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isChanging, setIsChanging] = useState(false)

  const handleChange = async () => {
    if (!selectedPlanId || !onChangePlan) return
    setIsChanging(true)
    try {
      await onChangePlan(selectedPlanId)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to change plan:", error)
    } finally {
      setIsChanging(false)
    }
  }

  const currentPlan = plans.find((p) => p.id === currentPlanId)
  const selectedPlan = plans.find((p) => p.id === selectedPlanId)

  const getPriceDifference = () => {
    if (!currentPlan || !selectedPlan) return null
    const diff = selectedPlan.price - currentPlan.price
    if (diff > 0) return `+${formatPrice(diff, selectedPlan.currency_code)}/${selectedPlan.billing_interval}`
    if (diff < 0) return `${formatPrice(diff, selectedPlan.currency_code)}/${selectedPlan.billing_interval}`
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Change Your Plan</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId
            const isSelected = plan.id === selectedPlanId

            return (
              <button
                key={plan.id}
                onClick={() => !isCurrent && setSelectedPlanId(plan.id)}
                disabled={isCurrent}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all",
                  isCurrent && "border-zinc-200 bg-zinc-50 opacity-60 cursor-not-allowed",
                  isSelected && !isCurrent && "border-zinc-900 bg-zinc-50",
                  !isCurrent && !isSelected && "border-zinc-200 hover:border-zinc-300"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-zinc-900">{plan.name}</h3>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-xs bg-zinc-200 text-zinc-600">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-zinc-900">
                      {formatPrice(plan.price, plan.currency_code)}
                    </p>
                    <p className="text-xs text-zinc-500">/{plan.billing_interval}</p>
                  </div>
                </div>

                {plan.features.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-100">
                    <ul className="grid grid-cols-2 gap-2">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-zinc-600">
                          <Check className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Summary */}
        {selectedPlan && (
          <div className="mt-6 p-4 bg-zinc-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600">
                  Switching from <span className="font-medium">{currentPlan?.name}</span> to{" "}
                  <span className="font-medium">{selectedPlan.name}</span>
                </p>
                {getPriceDifference() && (
                  <p className="text-sm text-zinc-500 mt-1">
                    Price change: {getPriceDifference()}
                  </p>
                )}
              </div>
              <Button onClick={handleChange} disabled={isChanging}>
                {isChanging ? "Changing..." : "Confirm Change"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
