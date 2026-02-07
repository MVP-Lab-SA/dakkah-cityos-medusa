import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { CompanyOrders } from "@/components/business"
import { useCompanyOrders } from "@/lib/hooks/use-companies"

export const Route = createFileRoute("/$countryCode/business/orders")({
  component: CompanyOrdersPage,
})

function CompanyOrdersPage() {
  const { countryCode } = Route.useParams()
  const { data: orders, isLoading, error } = useCompanyOrders()

  return (
    <AccountLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Company Orders</h1>
        <p className="text-zinc-500 mt-1">View all orders placed by your company</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-zinc-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-zinc-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-red-500">Failed to load company orders</p>
        </div>
      ) : (
        <CompanyOrders orders={orders || []} countryCode={countryCode} />
      )}
    </AccountLayout>
  )
}
