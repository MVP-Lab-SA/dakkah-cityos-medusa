import { createFileRoute, Link } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { POList } from "@/components/purchase-orders"
import { Button } from "@/components/ui/button"
import { Plus } from "@medusajs/icons"
import { usePurchaseOrders } from "@/lib/hooks/use-purchase-orders"
import { useAuth } from "@/lib/context/auth-context"

export const Route = createFileRoute("/$tenant/$locale/account/purchase-orders/")({
  component: PurchaseOrdersPage,
})

function PurchaseOrdersPage() {
  const { tenant, locale } = Route.useParams()
  const { customer } = useAuth()
  const { data: purchaseOrders = [], isLoading } = usePurchaseOrders(customer?.company_id)

  return (
    <AccountLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Purchase Orders</h1>
          <p className="text-zinc-500 mt-1">Manage your company's purchase orders</p>
        </div>
        <Link to={`/${tenant}/${locale}/account/purchase-orders/new` as any}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New PO
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-500">Loading purchase orders...</p>
        </div>
      ) : (
        <POList
          purchaseOrders={purchaseOrders}
        />
      )}
    </AccountLayout>
  )
}
