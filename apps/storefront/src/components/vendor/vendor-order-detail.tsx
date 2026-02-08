import { useVendorOrder, useUpdateVendorOrderStatus } from "@/lib/hooks/use-vendor-orders"
import { Button } from "@/components/ui/button"
import type { VendorOrderItem } from "@/lib/types/vendors"

interface VendorOrderDetailProps {
  orderId: string
}

export function VendorOrderDetail({ orderId }: VendorOrderDetailProps) {
  const { data: order, isLoading } = useVendorOrder(orderId)
  const updateStatus = useUpdateVendorOrderStatus()

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    )
  }

  if (!order) {
    return <div className="text-center py-12 text-muted-foreground">Order not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{order.display_id}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Order Total</p>
          <p className="text-2xl font-bold">${Number(order.vendor_total).toFixed(2)}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Commission</p>
          <p className="text-2xl font-bold text-red-600">-${Number(order.commission_amount).toFixed(2)}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Net Amount</p>
          <p className="text-2xl font-bold text-green-700">${Number(order.net_amount).toFixed(2)}</p>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b bg-muted/20">
          <h2 className="font-semibold">Customer</h2>
        </div>
        <div className="p-4">
          <p>{order.email}</p>
          {order.shipping_address && (
            <p className="text-sm text-muted-foreground mt-1">
              {order.shipping_address.address_1}, {order.shipping_address.city},{" "}
              {order.shipping_address.country_code?.toUpperCase()}
            </p>
          )}
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b bg-muted/20">
          <h2 className="font-semibold">Items</h2>
        </div>
        <div className="divide-y">
          {order.items.map((item: VendorOrderItem) => (
            <div key={item.id} className="p-4 flex items-center gap-4">
              {item.thumbnail && (
                <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded" />
              )}
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                {item.sku && <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>}
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                </p>
              </div>
              <p className="font-semibold">${Number(item.total).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {order.status === "pending" && (
        <div className="flex gap-3">
          <Button
            onClick={() => updateStatus.mutate({ orderId: order.id, status: "processing" })}
            disabled={updateStatus.isPending}
          >
            Accept Order
          </Button>
          <Button
            variant="outline"
            onClick={() => updateStatus.mutate({ orderId: order.id, status: "cancelled" })}
            disabled={updateStatus.isPending}
          >
            Decline
          </Button>
        </div>
      )}

      {order.status === "processing" && (
        <Button
          onClick={() => updateStatus.mutate({ orderId: order.id, status: "shipped" })}
          disabled={updateStatus.isPending}
        >
          Mark as Shipped
        </Button>
      )}
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-orange-100 text-orange-800",
  }
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || "bg-gray-100"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
