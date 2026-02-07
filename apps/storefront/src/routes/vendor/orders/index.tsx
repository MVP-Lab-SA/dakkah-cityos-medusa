import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { formatPrice } from "@/lib/utils/price"

export const Route = createFileRoute("/vendor/orders/")({
  component: VendorOrdersPage,
})

function useVendorOrders() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"

  return useQuery({
    queryKey: ["vendor-orders"],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/store/vendors/me/orders`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()
      return data.orders || []
    },
  })
}

function VendorOrdersPage() {
  const { data: orders, isLoading, error } = useVendorOrders()

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Failed to load orders. Please try again.
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">View and manage your orders</p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600">Orders will appear here once customers purchase your products.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <a
                      href={`/vendor/orders/${order.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      #{order.display_id || order.id.slice(0, 8)}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {order.customer?.email || order.email || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.items?.length || 0} items</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {formatPrice(order.total, order.currency_code)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
