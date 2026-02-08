import { createFileRoute, Link } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { useCustomerSubscriptions } from "@/lib/hooks/use-subscriptions"
import { formatPrice } from "@/lib/utils/price"
import { CreditCard, ChevronRight, ArrowPath } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/account/subscriptions/")({
  component: SubscriptionsPage,
})

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  canceled: "bg-red-100 text-red-700",
  past_due: "bg-orange-100 text-orange-700",
  trialing: "bg-blue-100 text-blue-700",
}

function SubscriptionsPage() {
  const { tenant, locale } = Route.useParams() as { locale: string }
  const { data: subscriptions, isLoading } = useCustomerSubscriptions()
  const baseHref = `/${tenant}/${locale}`

  return (
    <AccountLayout title="Subscriptions" description="Manage your active subscriptions">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-zinc-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !subscriptions?.length ? (
        <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
          <CreditCard className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500 mb-4">No subscriptions yet</p>
          <Link
            to={`${baseHref}/subscriptions` as any}
            className="inline-flex items-center text-sm font-medium text-zinc-900 hover:underline"
          >
            Browse subscription plans
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <Link
              key={subscription.id}
              to={`${baseHref}/account/subscriptions/${subscription.id}` as any}
              className="block bg-white rounded-lg border border-zinc-200 p-6 hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-100 rounded-lg">
                    <ArrowPath className="h-6 w-6 text-zinc-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">{subscription.plan.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      {formatPrice(subscription.plan.price, subscription.plan.currency_code)} /{" "}
                      {subscription.billing_interval}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          statusColors[subscription.status] || "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {subscription.status}
                      </span>
                      {subscription.status === "active" && (
                        <span className="text-xs text-zinc-500">
                          Renews{" "}
                          {new Date(subscription.current_period_end).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </AccountLayout>
  )
}
