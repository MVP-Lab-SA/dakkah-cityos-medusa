import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "~/lib/sdk"
import { formatPrice } from "~/lib/utils/prices"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { CheckCircle } from "@medusajs/icons"
import { toast } from "sonner"

export function VendorOrderList() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "orders"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/vendor/orders", {
        credentials: "include",
      })
      return response.json()
    },
  })

  const fulfillMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await sdk.client.fetch(`/vendor/orders/${orderId}/fulfill`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "orders"] })
      toast.success("Order fulfilled successfully")
    },
    onError: () => {
      toast.error("Failed to fulfill order")
    },
  })

  if (isLoading) {
    return <OrderListSkeleton />
  }

  const { orders } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage and fulfill customer orders
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground text-center">
              Orders containing your products will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.display_id}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(order.created_at).toLocaleDateString()} - {order.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    {order.status === "pending" && (
                      <Button
                        onClick={() => fulfillMutation.mutate(order.id)}
                        disabled={fulfillMutation.isPending}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Fulfill
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        {item.variant?.product?.thumbnail && (
                          <img
                            src={item.variant.product.thumbnail}
                            alt={item.variant.product.title}
                            className="h-12 w-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">
                            {item.variant?.product?.title || item.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.subtotal, order.currency_code)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <span className="font-semibold">Vendor Total</span>
                  <span className="text-lg font-bold">
                    {formatPrice(order.vendor_total, order.currency_code)}
                  </span>
                </div>

                {order.shipping_address && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Shipping Address</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address.address_1}
                      {order.shipping_address.address_2 && `, ${order.shipping_address.address_2}`}
                      <br />
                      {order.shipping_address.city}, {order.shipping_address.province}{" "}
                      {order.shipping_address.postal_code}
                      <br />
                      {order.shipping_address.country_code?.toUpperCase()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function OrderListSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
