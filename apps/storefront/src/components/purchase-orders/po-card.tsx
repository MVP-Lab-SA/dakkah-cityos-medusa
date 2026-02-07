import { Link } from "@tanstack/react-router"
import { PurchaseOrder } from "@/lib/hooks/use-purchase-orders"
import { formatPrice } from "@/lib/utils/price"
import { cn } from "@/lib/utils/cn"

interface POCardProps {
  purchaseOrder: PurchaseOrder
  countryCode: string
  compact?: boolean
}

export function POCard({ purchaseOrder: po, countryCode, compact = false }: POCardProps) {
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
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  const formatStatus = (status: PurchaseOrder["status"]) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (compact) {
    return (
      <Link
        to={`/${countryCode}/account/purchase-orders/${po.id}` as any}
        className="flex items-center justify-between p-4 bg-white rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors"
      >
        <div>
          <p className="font-medium text-zinc-900">{po.po_number}</p>
          <p className="text-sm text-zinc-500">
            {formatPrice(po.total, po.currency_code)}
          </p>
        </div>
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-medium",
          getStatusColor(po.status)
        )}>
          {formatStatus(po.status)}
        </span>
      </Link>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Link
            to={`/${countryCode}/account/purchase-orders/${po.id}` as any}
            className="font-semibold text-zinc-900 hover:text-zinc-600"
          >
            {po.po_number}
          </Link>
          <p className="text-sm text-zinc-500 mt-0.5">
            {new Date(po.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          getStatusColor(po.status)
        )}>
          {formatStatus(po.status)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
        <div>
          <p className="text-xs text-zinc-400">Items</p>
          <p className="font-medium text-zinc-900">{po.items.length}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400">Created By</p>
          <p className="font-medium text-zinc-900">{po.created_by_name || "You"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-400">Total</p>
          <p className="font-semibold text-zinc-900">
            {formatPrice(po.total, po.currency_code)}
          </p>
        </div>
      </div>
    </div>
  )
}
