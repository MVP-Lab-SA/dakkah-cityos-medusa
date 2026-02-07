import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils/price"
import { Clock, Check, XMark } from "@medusajs/icons"

interface PendingApproval {
  id: string
  type: "purchase_order" | "quote_request" | "limit_increase"
  title: string
  requestedBy: string
  requestedAt: string
  amount?: number
  currencyCode?: string
  details?: string
}

interface ApprovalQueueProps {
  items: PendingApproval[]
  countryCode: string
  onApprove?: (id: string) => Promise<void>
  onReject?: (id: string) => Promise<void>
}

export function ApprovalQueue({
  items,
  countryCode,
  onApprove,
  onReject,
}: ApprovalQueueProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeLabel = (type: PendingApproval["type"]) => {
    switch (type) {
      case "purchase_order":
        return "Purchase Order"
      case "quote_request":
        return "Quote Request"
      case "limit_increase":
        return "Limit Increase"
    }
  }

  const getTypeColor = (type: PendingApproval["type"]) => {
    switch (type) {
      case "purchase_order":
        return "bg-blue-100 text-blue-800"
      case "quote_request":
        return "bg-purple-100 text-purple-800"
      case "limit_increase":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">All Caught Up</h3>
        <p className="text-zinc-500">No pending approvals at this time</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Pending Approvals</h3>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          {items.length} pending
        </span>
      </div>

      <div className="divide-y divide-zinc-100">
        {items.map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mt-1">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-zinc-900">{item.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">
                    Requested by {item.requestedBy} on {formatDate(item.requestedAt)}
                  </p>
                  {item.details && (
                    <p className="text-sm text-zinc-600 mt-2">{item.details}</p>
                  )}
                </div>
              </div>

              {item.amount !== undefined && item.currencyCode && (
                <p className="text-xl font-bold text-zinc-900">
                  {formatPrice(item.amount, item.currencyCode)}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              {item.type === "purchase_order" && (
                <Link
                  to={`/${countryCode}/account/purchase-orders/${item.id}`}
                  className="text-sm text-zinc-600 hover:text-zinc-900"
                >
                  View Details
                </Link>
              )}
              {item.type !== "purchase_order" && <div />}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject?.(item.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <XMark className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm" onClick={() => onApprove?.(item.id)}>
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
