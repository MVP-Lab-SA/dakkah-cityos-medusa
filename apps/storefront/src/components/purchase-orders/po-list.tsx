import { Link } from "@tanstack/react-router"
import { PurchaseOrder } from "@/lib/hooks/use-purchase-orders"
import { formatPrice } from "@/lib/utils/price"
import { ChevronRight, DocumentText } from "@medusajs/icons"
import { cn } from "@/lib/utils/cn"

interface POListProps {
  purchaseOrders: PurchaseOrder[]
  countryCode: string
  emptyMessage?: string
}

export function POList({ 
  purchaseOrders, 
  countryCode, 
  emptyMessage = "No purchase orders found" 
}: POListProps) {
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
      case "cancelled":
        return "bg-zinc-100 text-zinc-500"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  const formatStatus = (status: PurchaseOrder["status"]) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (purchaseOrders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <DocumentText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <p className="text-zinc-500">{emptyMessage}</p>
        <Link
          to={`/${countryCode}/account/purchase-orders/new` as any}
          className="inline-block mt-4 text-sm font-medium text-zinc-900 hover:underline"
        >
          Create your first purchase order
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {purchaseOrders.map((po) => (
        <Link
          key={po.id}
          to={`/${countryCode}/account/purchase-orders/${po.id}` as any}
          className="block bg-white rounded-xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-zinc-900">{po.po_number}</h3>
              <p className="text-sm text-zinc-500 mt-0.5">
                Created {formatDate(po.created_at)}
              </p>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              getStatusColor(po.status)
            )}>
              {formatStatus(po.status)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-zinc-400">Items</p>
                <p className="font-medium text-zinc-900">{po.items.length}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Total</p>
                <p className="font-semibold text-zinc-900">
                  {formatPrice(po.total, po.currency_code)}
                </p>
              </div>
            </div>
            <span className="text-sm text-zinc-500 flex items-center gap-1">
              View details
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
