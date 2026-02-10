import { Link } from "@tanstack/react-router"
import { formatPrice } from "@/lib/utils/price"
import { cn } from "@/lib/utils/cn"
import { ChevronRight } from "@medusajs/icons"
import { useTenantPrefix } from "@/lib/context/tenant-context"

interface CompanyOrder {
  id: string
  display_id: string
  status: string
  total: number
  currency_code: string
  created_at: string
  ordered_by: string
  item_count: number
}

interface CompanyOrdersProps {
  orders: CompanyOrder[]
}

export function CompanyOrders({ orders }: CompanyOrdersProps) {
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

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <p className="text-zinc-500">No company orders yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                Ordered By
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-zinc-900">#{order.display_id}</p>
                  <p className="text-sm text-zinc-500">{order.item_count} items</p>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-600">
                  {order.ordered_by}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-600">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium capitalize",
                    getStatusColor(order.status)
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium text-zinc-900">
                  {formatPrice(order.total, order.currency_code)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`${prefix}/account/orders/${order.id}` as any}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
