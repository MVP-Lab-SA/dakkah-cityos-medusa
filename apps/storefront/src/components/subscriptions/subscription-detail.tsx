import { Subscription } from "@/lib/types/subscriptions"
import { formatPrice } from "@/lib/utils/price"
import { cn } from "@/lib/utils/cn"

interface SubscriptionDetailProps {
  subscription: Subscription
}

export function SubscriptionDetail({ subscription }: SubscriptionDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  const formatDate = (date?: string) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">{subscription.plan.name}</h2>
            <p className="text-zinc-500 mt-1">{subscription.plan.description}</p>
          </div>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium capitalize",
            getStatusColor(subscription.status)
          )}>
            {subscription.status}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-6">
        {/* Pricing */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 mb-3">Pricing</h3>
          <div className="bg-zinc-50 rounded-lg p-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-zinc-900">
                {formatPrice(subscription.plan.price, subscription.plan.currency_code)}
              </span>
              <span className="text-zinc-500">/{subscription.plan.billing_interval}</span>
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 mb-3">Billing Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Start Date</p>
              <p className="text-sm text-zinc-900 mt-1">{formatDate(subscription.start_date)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Next Billing</p>
              <p className="text-sm text-zinc-900 mt-1">{formatDate(subscription.next_billing_date)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Billing Cycle</p>
              <p className="text-sm text-zinc-900 mt-1 capitalize">{subscription.plan.billing_interval}ly</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Auto-Renew</p>
              <p className="text-sm text-zinc-900 mt-1">
                {subscription.status === "active" ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        {subscription.plan.features && subscription.plan.features.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Included Features</h3>
            <ul className="space-y-2">
              {subscription.plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-zinc-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
