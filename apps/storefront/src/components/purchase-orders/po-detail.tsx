import { PurchaseOrder } from "@/lib/hooks/use-purchase-orders"
import { formatPrice } from "@/lib/utils/price"
import { cn } from "@/lib/utils/cn"

interface PODetailProps {
  purchaseOrder: PurchaseOrder
}

export function PODetail({ purchaseOrder: po }: PODetailProps) {
  const getStatusColor = (status: PurchaseOrder["status"]) => {
    switch (status) {
      case "draft":
        return "bg-zinc-100 text-zinc-800"
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "fulfilled":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  const formatStatus = (status: PurchaseOrder["status"]) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatDate = (date?: string) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">{po.po_number}</h2>
            <p className="text-zinc-500 mt-1">Created {formatDate(po.created_at)}</p>
          </div>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            getStatusColor(po.status)
          )}>
            {formatStatus(po.status)}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="p-6 grid grid-cols-2 gap-6 border-b border-zinc-200">
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Created By</p>
          <p className="text-sm text-zinc-900 mt-1">{po.created_by_name || "You"}</p>
        </div>
        {po.approved_by && (
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">Approved By</p>
            <p className="text-sm text-zinc-900 mt-1">{po.approved_by_name}</p>
          </div>
        )}
        {po.submitted_at && (
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">Submitted</p>
            <p className="text-sm text-zinc-900 mt-1">{formatDate(po.submitted_at)}</p>
          </div>
        )}
        {po.approved_at && (
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">Approved</p>
            <p className="text-sm text-zinc-900 mt-1">{formatDate(po.approved_at)}</p>
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="p-6 border-b border-zinc-200">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">Line Items</h3>
        <div className="space-y-3">
          {po.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
              <div>
                <p className="font-medium text-zinc-900">{item.product_title}</p>
                {item.variant_title && (
                  <p className="text-sm text-zinc-500">{item.variant_title}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-600">
                  {formatPrice(item.unit_price, po.currency_code)} x {item.quantity}
                </p>
                <p className="font-medium text-zinc-900">
                  {formatPrice(item.total, po.currency_code)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="p-6 bg-zinc-50">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="text-zinc-900">{formatPrice(po.subtotal, po.currency_code)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Shipping</span>
            <span className="text-zinc-900">{formatPrice(po.shipping_total, po.currency_code)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Tax</span>
            <span className="text-zinc-900">{formatPrice(po.tax_total, po.currency_code)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-zinc-200">
            <span className="font-semibold text-zinc-900">Total</span>
            <span className="font-semibold text-zinc-900">
              {formatPrice(po.total, po.currency_code)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {po.notes && (
        <div className="p-6 border-t border-zinc-200">
          <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Notes</p>
          <p className="text-sm text-zinc-600">{po.notes}</p>
        </div>
      )}
    </div>
  )
}
