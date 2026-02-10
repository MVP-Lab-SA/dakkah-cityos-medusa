import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { PauseSolid, PlaySolid, XMark, ArrowUpDown } from "@medusajs/icons"

interface SubscriptionActionsProps {
  subscriptionId: string
  status: string
  onPause?: () => Promise<void>
  onResume?: () => Promise<void>
  onCancel?: () => Promise<void>
  onChangePlan?: () => void
}

export function SubscriptionActions({
  subscriptionId,
  status,
  onPause,
  onResume,
  onCancel,
  onChangePlan,
}: SubscriptionActionsProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const toast = useToast()

  const handleAction = async (action: string, callback?: () => Promise<void>) => {
    if (!callback) return
    setIsProcessing(action)
    try {
      await callback()
      toast.success(`Subscription ${action}d successfully`)
    } catch (error) {
      toast.error(`Failed to ${action} subscription. Please try again.`)
    } finally {
      setIsProcessing(null)
    }
  }

  const isActive = status.toLowerCase() === "active"
  const isPaused = status.toLowerCase() === "paused"
  const isCancelled = status.toLowerCase() === "cancelled"

  if (isCancelled) {
    return (
      <div className="bg-ds-background rounded-xl border border-ds-border p-6">
        <h3 className="text-lg font-semibold text-ds-foreground mb-2">Subscription Cancelled</h3>
        <p className="text-sm text-ds-muted-foreground mb-4">
          This subscription has been cancelled. You can resubscribe anytime.
        </p>
        <Button>Resubscribe</Button>
      </div>
    )
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border p-6">
      <h3 className="text-lg font-semibold text-ds-foreground mb-4">Manage Subscription</h3>
      
      <div className="space-y-3">
        {/* Pause/Resume */}
        {isActive && onPause && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAction("pause", onPause)}
            disabled={isProcessing !== null}
          >
            <PauseSolid className="w-4 h-4 me-2" />
            {isProcessing === "pause" ? "Pausing..." : "Pause Subscription"}
          </Button>
        )}

        {isPaused && onResume && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAction("resume", onResume)}
            disabled={isProcessing !== null}
          >
            <PlaySolid className="w-4 h-4 me-2" />
            {isProcessing === "resume" ? "Resuming..." : "Resume Subscription"}
          </Button>
        )}

        {/* Change Plan */}
        {!isCancelled && onChangePlan && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onChangePlan}
            disabled={isProcessing !== null}
          >
            <ArrowUpDown className="w-4 h-4 me-2" />
            Change Plan
          </Button>
        )}

        {/* Cancel */}
        {!isCancelled && onCancel && (
          <Button
            variant="ghost"
            className="w-full justify-start text-ds-destructive hover:text-ds-destructive hover:bg-ds-destructive"
            onClick={() => handleAction("cancel", onCancel)}
            disabled={isProcessing !== null}
          >
            <XMark className="w-4 h-4 me-2" />
            {isProcessing === "cancel" ? "Cancelling..." : "Cancel Subscription"}
          </Button>
        )}
      </div>

      {/* Warning for pause */}
      {isPaused && (
        <p className="mt-4 text-xs text-ds-warning bg-ds-warning p-3 rounded-lg">
          Your subscription is paused. You won't be charged until you resume, but you also won't have access to subscription benefits.
        </p>
      )}
    </div>
  )
}
