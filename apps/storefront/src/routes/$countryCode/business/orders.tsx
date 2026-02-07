import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { CompanyOrders } from "@/components/business"

export const Route = createFileRoute("/$countryCode/business/orders")({
  component: CompanyOrdersPage,
})

function CompanyOrdersPage() {
  const { countryCode } = Route.useParams()

  // Mock company orders
  const orders = [
    {
      id: "order_1",
      display_id: "ORD-001",
      status: "delivered",
      total: 1250,
      currency_code: "usd",
      created_at: "2024-12-15T10:00:00Z",
      ordered_by: "Sarah Buyer",
      item_count: 5,
    },
    {
      id: "order_2",
      display_id: "ORD-002",
      status: "shipped",
      total: 890,
      currency_code: "usd",
      created_at: "2024-12-14T14:30:00Z",
      ordered_by: "Mike Jones",
      item_count: 3,
    },
    {
      id: "order_3",
      display_id: "ORD-003",
      status: "processing",
      total: 2100,
      currency_code: "usd",
      created_at: "2024-12-13T09:15:00Z",
      ordered_by: "Sarah Buyer",
      item_count: 8,
    },
    {
      id: "order_4",
      display_id: "ORD-004",
      status: "pending",
      total: 450,
      currency_code: "usd",
      created_at: "2024-12-12T16:45:00Z",
      ordered_by: "John Admin",
      item_count: 2,
    },
    {
      id: "order_5",
      display_id: "ORD-005",
      status: "completed",
      total: 3200,
      currency_code: "usd",
      created_at: "2024-12-10T11:00:00Z",
      ordered_by: "Mike Jones",
      item_count: 12,
    },
  ]

  return (
    <AccountLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Company Orders</h1>
        <p className="text-zinc-500 mt-1">View all orders placed by your company</p>
      </div>

      <CompanyOrders orders={orders} countryCode={countryCode} />
    </AccountLayout>
  )
}
