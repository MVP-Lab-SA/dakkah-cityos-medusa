import { createFileRoute, Link } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { OrderDetail } from "@/components/orders"
import { useOrder } from "@/lib/hooks/use-orders"
import { ArrowLeft, Spinner } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/account/orders/$id")({
  component: OrderDetailPage,
})

function OrderDetailPage() {
  const { tenant, locale, id } = Route.useParams() as { tenant: string; locale: string; id: string }
  const { data: order, isLoading, error } = useOrder({ order_id: id })
  const baseHref = `/${tenant}/${locale}`

  if (isLoading) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      </AccountLayout>
    )
  }

  if (error || !order) {
    return (
      <AccountLayout>
        <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500 mb-4">Order not found</p>
          <Link
            to={`${baseHref}/account/orders` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to orders
          </Link>
        </div>
      </AccountLayout>
    )
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          to={`${baseHref}/account/orders` as any}
          className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to orders
        </Link>

        <OrderDetail order={order as any} />
      </div>
    </AccountLayout>
  )
}
