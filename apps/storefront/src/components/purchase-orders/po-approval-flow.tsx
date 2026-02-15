import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PurchaseOrder } from "@/lib/hooks/use-purchase-orders"
import { Check, XMark, Clock } from "@medusajs/icons"

interface POApprovalFlowProps {
  purchaseOrder: PurchaseOrder
  canApprove?: boolean
  onApprove?: () => Promise<void>
  onReject?: (reason?: string) => Promise<void>
}

export function POApprovalFlow({
  purchaseOrder: po,
  canApprove = false,
  onApprove,
  onReject,
}: POApprovalFlowProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const handleApprove = async () => {
    if (!onApprove) return
    setIsProcessing("approve")
    try {
      await onApprove()
    } finally {
      setIsProcessing(null)
    }
  }

  const handleReject = async () => {
    if (!onReject) return
    setIsProcessing("reject")
    try {
      await onReject(rejectReason)
      setShowRejectReason(false)
    } finally {
      setIsProcessing(null)
    }
  }

  if (po.status === "approved") {
    return (
      <div className="bg-ds-success rounded-xl border border-ds-success p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ds-success flex items-center justify-center">
            <Check className="w-5 h-5 text-ds-success" />
          </div>
          <div>
            <h3 className="font-semibold text-ds-success">Approved</h3>
            {po.approved_by_name && (
              <p className="text-sm text-ds-success">
                By {po.approved_by_name} on {new Date(po.approved_at || "").toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (po.status === "rejected") {
    return (
      <div className="bg-ds-destructive rounded-xl border border-ds-destructive p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ds-destructive flex items-center justify-center">
            <XMark className="w-5 h-5 text-ds-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-ds-destructive">Rejected</h3>
            <p className="text-sm text-ds-destructive">
              This purchase order was rejected. Please review and resubmit.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (po.status === "pending_approval") {
    return (
      <div className="bg-ds-warning rounded-xl border border-ds-warning p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ds-warning flex items-center justify-center">
              <Clock className="w-5 h-5 text-ds-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-ds-warning">Pending Approval</h3>
              <p className="text-sm text-ds-warning">
                {canApprove
                  ? "This purchase order requires your approval"
                  : "Waiting for manager approval"
                }
              </p>
            </div>
          </div>

          {canApprove && !showRejectReason && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectReason(true)}
                disabled={isProcessing !== null}
              >
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isProcessing !== null}
                className="bg-ds-success hover:bg-ds-success"
              >
                {isProcessing === "approve" ? "Approving..." : "Approve"}
              </Button>
            </div>
          )}
        </div>

        {showRejectReason && (
          <div className="mt-4 pt-4 border-t border-ds-warning">
            <label className="block text-sm font-medium text-ds-warning mb-2">
              Reason for rejection (optional)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Provide a reason..."
              rows={2}
              className="w-full rounded-lg border border-ds-warning px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ds-warning"
            />
            <div className="flex gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRejectReason(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReject}
                disabled={isProcessing !== null}
                className="bg-ds-destructive hover:bg-ds-destructive"
              >
                {isProcessing === "reject" ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}
