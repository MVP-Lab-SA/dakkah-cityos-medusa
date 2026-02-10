import { Link } from "@tanstack/react-router"
import { useTenantPrefix } from "@/lib/context/tenant-context"
import { formatPrice } from "@/lib/utils/price"
import { ShoppingBag, ChevronRight, MagnifyingGlass } from "@medusajs/icons"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface OrderItem {
  id: string
  title: string
  thumbnail?: string
  quantity: number
}

interface Order {
  id: string
  display_id: number
  created_at: string
  status: string
  fulfillment_status: string
  payment_status: string
  total: number
  currency_code: string
  items: OrderItem[]
}

interface OrderListProps {
  orders: Order[]
  isLoading?: boolean
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  requires_action: "bg-orange-100 text-orange-700",
}

const fulfillmentStatusLabels: Record<string, string> = {
  not_fulfilled: "Processing",
  partially_fulfilled: "Partially Shipped",
  fulfilled: "Shipped",
  partially_shipped: "Partially Shipped",
  shipped: "Shipped",
  partially_returned: "Partially Returned",
  returned: "Returned",
  canceled: "Canceled",
}

export function OrderList({ orders, isLoading }: OrderListProps) {
  const prefix = useTenantPrefix()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.display_id.toString().includes(searchQuery) ||
      order.items.some((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.fulfillment_status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-zinc-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 border border-zinc-200 rounded-md text-sm"
        >
          <option value="all">All statuses</option>
          <option value="not_fulfilled">Processing</option>
          <option value="fulfilled">Shipped</option>
          <option value="returned">Returned</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Order List */}
      {!filteredOrders?.length ? (
        <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
          <ShoppingBag className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500">
            {searchQuery || statusFilter !== "all" ? "No orders match your filters" : "No orders yet"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Link
              to={`${prefix}/store` as any}
              className="mt-4 inline-flex items-center text-sm font-medium text-zinc-900 hover:underline"
            >
              Start shopping
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Link
              key={order.id}
              to={`${prefix}/account/orders/${order.id}` as any}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors"
            >
              {/* Thumbnails */}
              <div className="flex -space-x-2 flex-shrink-0">
                {order.items.slice(0, 3).map((item, i) => (
                  <div
                    key={item.id}
                    className="w-12 h-12 rounded-md bg-zinc-100 border-2 border-white overflow-hidden"
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
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 rounded-md bg-zinc-200 border-2 border-white flex items-center justify-center text-xs font-medium text-zinc-600">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-zinc-900">Order #{order.display_id}</p>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                      statusColors[order.fulfillment_status] || "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {fulfillmentStatusLabels[order.fulfillment_status] || order.fulfillment_status}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 mt-1">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-zinc-500">
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>

              {/* Total */}
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-semibold text-zinc-900">
                  {formatPrice(order.total, order.currency_code)}
                </p>
              </div>

              <ChevronRight className="h-5 w-5 text-zinc-400 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
