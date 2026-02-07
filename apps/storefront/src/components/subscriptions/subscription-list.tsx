import { Link } from "@tanstack/react-router"
import { Subscription } from "@/lib/types/subscriptions"
import { formatPrice } from "@/lib/utils/price"
import { ChevronRight, CreditCard } from "@medusajs/icons"
import { cn } from "@/lib/utils/cn"

interface SubscriptionListProps {
  subscriptions: Subscription[]
  countryCode: string
  emptyMessage?: string
}

export function SubscriptionList({ 
  subscriptions, 
  countryCode, 
  emptyMessage = "No subscriptions found" 
}: SubscriptionListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-zinc-100 text-zinc-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <CreditCard className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <p className="text-zinc-500">{emptyMessage}</p>
        <Link
          to={`/${countryCode}/subscriptions`}
          className="inline-block mt-4 text-sm font-medium text-zinc-900 hover:underline"
        >
          Browse subscription plans
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <Link
          key={subscription.id}
          to={`/${countryCode}/account/subscriptions/${subscription.id}`}
          className="block bg-white rounded-xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-zinc-900">{subscription.plan.name}</h3>
              <p className="text-sm text-zinc-500 mt-0.5">{subscription.plan.description}</p>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium capitalize",
              getStatusColor(subscription.status)
            )}>
              {subscription.status}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-zinc-400">Price</p>
                <p className="font-semibold text-zinc-900">
                  {formatPrice(subscription.plan.price, subscription.plan.currency_code)}/{subscription.plan.billing_interval}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Next Billing</p>
                <p className="text-sm text-zinc-700">
                  {subscription.next_billing_date 
                    ? new Date(subscription.next_billing_date).toLocaleDateString()
                    : "N/A"
                  }
                </p>
              </div>
            </div>
            <span className="text-sm text-zinc-500 flex items-center gap-1">
              Manage
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
