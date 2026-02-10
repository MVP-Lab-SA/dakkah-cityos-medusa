import { Link } from "@tanstack/react-router"
import { useTenantPrefix } from "@/lib/context/tenant-context"
import { formatPrice } from "@/lib/utils/price"
import { ChevronRight, ShoppingBag } from "@medusajs/icons"

interface Order {
  id: string
  display_id: number
  created_at: string
  status: string
  total: number
  currency_code: string
  items: Array<{
    id: string
    title: string
    thumbnail?: string
    quantity: number
  }>
}

interface RecentOrdersProps {
  orders: Order[]
  isLoading?: boolean
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
}

export function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  const prefix = useTenantPrefix()

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-zinc-200">
        <div className="p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Orders</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-zinc-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!orders?.length) {
    return (
      <div className="bg-white rounded-lg border border-zinc-200">
        <div className="p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Orders</h2>
        </div>
        <div className="p-8 text-center">
          <ShoppingBag className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500">No orders yet</p>
          <Link
            to={`${prefix}/store` as any}
            className="mt-4 inline-flex items-center text-sm font-medium text-zinc-900 hover:underline"
          >
            Start shopping
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-200">
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Recent Orders</h2>
        <Link
          to={`${prefix}/account/orders` as any}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          View all
        </Link>
      </div>
      <div className="divide-y divide-zinc-100">
        {orders.slice(0, 3).map((order) => (
          <Link
            key={order.id}
            to={`${prefix}/account/orders/${order.id}` as any}
            className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors"
          >
            {/* Thumbnails */}
            <div className="flex -space-x-2">
              {order.items.slice(0, 3).map((item, i) => (
                <div
                  key={item.id}
                  className="w-10 h-10 rounded-md bg-zinc-100 border-2 border-white overflow-hidden"
                  style={{ zIndex: 3 - i }}
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-10 h-10 rounded-md bg-zinc-200 border-2 border-white flex items-center justify-center text-xs font-medium text-zinc-600">
                  +{order.items.length - 3}
                </div>
              )}
            </div>

            {/* Order Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900">Order #{order.display_id}</p>
              <p className="text-sm text-zinc-500">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Status & Total */}
            <div className="text-right">
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                  statusColors[order.status] || "bg-zinc-100 text-zinc-700"
                }`}
              >
                {order.status}
              </span>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {formatPrice(order.total, order.currency_code)}
              </p>
            </div>

            <ChevronRight className="h-5 w-5 text-zinc-400" />
          </Link>
        ))}
      </div>
    </div>
  )
}
