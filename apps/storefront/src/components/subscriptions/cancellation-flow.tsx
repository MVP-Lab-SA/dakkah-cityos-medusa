import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExclamationCircle, Gift, Check } from "@medusajs/icons"

interface CancellationFlowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscriptionName: string
  onCancel?: (reason: string, feedback?: string) => Promise<void>
  onAcceptOffer?: () => Promise<void>
}

export function CancellationFlow({
  open,
  onOpenChange,
  subscriptionName,
  onCancel,
  onAcceptOffer,
}: CancellationFlowProps) {
  const [step, setStep] = useState<"reason" | "offer" | "confirm" | "done">("reason")
  const [selectedReason, setSelectedReason] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const reasons = [
    "Too expensive",
    "Not using it enough",
    "Found a better alternative",
    "Missing features I need",
    "Technical issues",
    "Other",
  ]

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason)
    // Show retention offer for price-related cancellations
    if (reason === "Too expensive") {
      setStep("offer")
    } else {
      setStep("confirm")
    }
  }

  const handleAcceptOffer = async () => {
    setIsProcessing(true)
    try {
      await onAcceptOffer?.()
      setStep("done")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmCancel = async () => {
    setIsProcessing(true)
    try {
      await onCancel?.(selectedReason, feedback)
      setStep("done")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetAndClose = () => {
    setStep("reason")
    setSelectedReason("")
    setFeedback("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md">
        {step === "reason" && (
          <>
            <DialogHeader>
              <DialogTitle>Why are you cancelling?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-ds-muted-foreground mt-2">
              We're sorry to see you go. Help us improve by telling us why you're cancelling.
            </p>
            <div className="mt-4 space-y-2">
              {reasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReasonSelect(reason)}
                  className="w-full text-start px-4 py-3 rounded-lg border border-ds-border hover:border-ds-border hover:bg-ds-muted transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
            <Button variant="ghost" className="mt-4 w-full" onClick={resetAndClose}>
              Never mind, keep my subscription
            </Button>
          </>
        )}

        {step === "offer" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-ds-success" />
                Special Offer for You
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 p-4 bg-ds-success rounded-xl border border-ds-success">
              <p className="font-semibold text-ds-success">Get 50% off your next 3 months!</p>
              <p className="text-sm text-ds-success mt-1">
                We'd hate to lose you. Stay with us and save on your {subscriptionName} subscription.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <Button className="w-full" onClick={handleAcceptOffer} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Accept Offer & Stay"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep("confirm")}>
                No thanks, continue cancelling
              </Button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ExclamationCircle className="w-5 h-5 text-ds-destructive" />
                Confirm Cancellation
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-ds-muted-foreground mt-2">
              Are you sure you want to cancel your {subscriptionName} subscription? 
              You'll lose access to all benefits at the end of your current billing period.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-ds-foreground mb-1">
                Any additional feedback? (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us how we can improve..."
                className="w-full rounded-lg border border-ds-border px-3 py-2 text-sm h-24 resize-none"
              />
            </div>
            <div className="mt-6 space-y-3">
              <Button 
                variant="outline" 
                className="w-full text-ds-destructive hover:text-ds-destructive hover:bg-ds-destructive" 
                onClick={handleConfirmCancel}
                disabled={isProcessing}
              >
                {isProcessing ? "Cancelling..." : "Yes, Cancel My Subscription"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={resetAndClose}>
                Keep my subscription
              </Button>
            </div>
          </>
        )}

        {step === "done" && (
          <>
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-ds-success flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-ds-success" />
              </div>
              <h3 className="text-xl font-semibold text-ds-foreground mb-2">
                {selectedReason === "Too expensive" && onAcceptOffer 
                  ? "Offer Applied!" 
                  : "Subscription Cancelled"
                }
              </h3>
              <p className="text-ds-muted-foreground">
                {selectedReason === "Too expensive" && onAcceptOffer 
                  ? "Your discount has been applied. Thank you for staying with us!"
                  : "Your subscription will remain active until the end of your current billing period."
                }
              </p>
              <Button className="mt-6" onClick={resetAndClose}>
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
