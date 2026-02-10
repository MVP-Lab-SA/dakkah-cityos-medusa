import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { CompanyOrders } from "@/components/business"
import { useCompanyOrders } from "@/lib/hooks/use-companies"

export const Route = createFileRoute("/$tenant/$locale/business/orders")({
  component: CompanyOrdersPage,
})

function CompanyOrdersPage() {
  const { tenant, locale } = Route.useParams()
  const { data: orders, isLoading, error } = useCompanyOrders()

  return (
    <AccountLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ds-foreground">Company Orders</h1>
        <p className="text-ds-muted-foreground mt-1">View all orders placed by your company</p>
      </div>

      {isLoading ? (
        <div className="bg-ds-background rounded-xl border border-ds-border p-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-ds-muted rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-ds-muted rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-ds-background rounded-xl border border-ds-border p-12 text-center">
          <p className="text-ds-destructive">Failed to load company orders</p>
        </div>
      ) : (
        <CompanyOrders orders={orders || []} />
      )}
    </AccountLayout>
  )
}
