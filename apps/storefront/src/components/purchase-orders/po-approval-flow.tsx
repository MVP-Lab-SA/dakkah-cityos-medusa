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
      <div className="bg-green-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800">Approved</h3>
            {po.approved_by_name && (
              <p className="text-sm text-green-700">
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
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <XMark className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Rejected</h3>
            <p className="text-sm text-red-700">
              This purchase order was rejected. Please review and resubmit.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (po.status === "pending_approval") {
    return (
      <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800">Pending Approval</h3>
              <p className="text-sm text-yellow-700">
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
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing === "approve" ? "Approving..." : "Approve"}
              </Button>
            </div>
          )}
        </div>

        {showRejectReason && (
          <div className="mt-4 pt-4 border-t border-yellow-200">
            <label className="block text-sm font-medium text-yellow-800 mb-2">
              Reason for rejection (optional)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Provide a reason..."
              rows={2}
              className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                className="bg-red-600 hover:bg-red-700"
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
