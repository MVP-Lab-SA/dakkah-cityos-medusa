import { Link } from "@tanstack/react-router"
import { formatPrice } from "@/lib/utils/price"
import { ChevronRight } from "@medusajs/icons"
import { useTenantPrefix } from "@/lib/context/tenant-context"

interface OrderItem {
  title: string
  thumbnail?: string
  quantity: number
}

interface OrderCardProps {
  id: string
  displayId: string
  createdAt: string
  status: string
  total: number
  currencyCode: string
  items: OrderItem[]
}

export function OrderCard({
  id,
  displayId,
  createdAt,
  status,
  total,
  currencyCode,
  items,
}: OrderCardProps) {
  const prefix = useTenantPrefix()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800"
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
      case "refunded":
        return "bg-red-100 text-red-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Link
      to={`${prefix}/account/orders/${id}` as any}
      className="block bg-white rounded-xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-zinc-900">Order #{displayId}</p>
          <p className="text-sm text-zinc-500">{formatDate(createdAt)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex -space-x-2">
          {items.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-lg bg-zinc-100 border-2 border-white overflow-hidden"
            >
              {item.thumbnail ? (
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                  No img
                </div>
              )}
            </div>
          ))}
          {items.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-zinc-200 border-2 border-white flex items-center justify-center text-xs font-medium text-zinc-600">
              +{items.length - 3}
            </div>
          )}
        </div>
        <span className="text-sm text-zinc-500">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
        <span className="font-semibold text-zinc-900">
          {formatPrice(total, currencyCode)}
        </span>
        <span className="text-sm text-zinc-500 flex items-center gap-1">
          View details
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}
