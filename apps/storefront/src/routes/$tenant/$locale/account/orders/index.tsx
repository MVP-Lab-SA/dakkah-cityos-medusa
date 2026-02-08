import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { OrderList } from "@/components/orders"
import { useCustomerOrders } from "@/lib/hooks/use-orders"

export const Route = createFileRoute("/$tenant/$locale/account/orders/")({
  component: OrdersPage,
})

function OrdersPage() {
  const { data: orders, isLoading } = useCustomerOrders({
    fields: "*items,*items.thumbnail",
  })

  return (
    <AccountLayout title="Orders" description="View and track your orders">
      <OrderList orders={orders as any || []} isLoading={isLoading} />
    </AccountLayout>
  )
}
