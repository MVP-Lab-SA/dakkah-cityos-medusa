import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "@medusajs/icons"
import { formatPrice } from "@/lib/utils/price"

export const Route = createFileRoute("/vendor/orders/$orderId")({
  component: VendorOrderDetailPage,
})

function useVendorOrder(orderId: string) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"

  return useQuery({
    queryKey: ["vendor-order", orderId],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/store/vendors/me/orders/${orderId}`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch order")
      const data = await response.json()
      return data.order
    },
  })
}

function VendorOrderDetailPage() {
  const { orderId } = Route.useParams()
  const { data: order, isLoading, error } = useVendorOrder(orderId)

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Order not found or failed to load.
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
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <Link
          to="/vendor/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.display_id || order.id.slice(0, 8)}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Order Items */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Items</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {order.items?.map((item: any) => (
              <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  {item.variant?.title && (
                    <p className="text-sm text-gray-600">{item.variant.title}</p>
                  )}
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900">
                  {formatPrice(item.unit_price * item.quantity, order.currency_code)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal, order.currency_code)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_total, order.currency_code)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatPrice(order.tax_total, order.currency_code)}</span>
            </div>
            {order.discount_total > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(order.discount_total, order.currency_code)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatPrice(order.total, order.currency_code)}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <div className="space-y-2 text-gray-600">
              <p>{order.customer?.first_name} {order.customer?.last_name}</p>
              <p>{order.customer?.email || order.email}</p>
              {order.customer?.phone && <p>{order.customer.phone}</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            {order.shipping_address ? (
              <div className="space-y-1 text-gray-600">
                <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                <p>{order.shipping_address.address_1}</p>
                {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.province}{" "}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country_code?.toUpperCase()}</p>
              </div>
            ) : (
              <p className="text-gray-600">No shipping address</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
