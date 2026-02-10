import {
  Calendar,
  CreditCard,
  ArrowPath,
  XCircle,
  PlaySolid,
  PauseSolid,
} from "@medusajs/icons"
import { useTenantPrefix } from "@/lib/context/tenant-context"
import type { Subscription, SubscriptionStatus } from "../../lib/types/subscriptions"

interface SubscriptionCardProps {
  subscription: Subscription
  onPause?: (id: string) => void
  onResume?: (id: string) => void
  onCancel?: (id: string) => void
}

export function SubscriptionCard({
  subscription,
  onPause,
  onResume,
  onCancel,
}: SubscriptionCardProps) {
  const prefix = useTenantPrefix()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const statusConfig: Record<
    SubscriptionStatus,
    { label: string; className: string }
  > = {
    active: { label: "Active", className: "badge-success" },
    trialing: { label: "Trial", className: "badge-primary" },
    paused: { label: "Paused", className: "badge-warning" },
    past_due: { label: "Past Due", className: "badge-danger" },
    canceled: { label: "Canceled", className: "badge-neutral" },
    unpaid: { label: "Unpaid", className: "badge-danger" },
    incomplete: { label: "Incomplete", className: "badge-warning" },
  }

  const status = statusConfig[subscription.status]

  return (
    <div className="enterprise-card overflow-hidden">
      <div className="enterprise-card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {subscription.plan?.name || "Subscription"}
            </h3>
            <p className="text-sm text-slate-500">
              {subscription.plan
                ? `${formatPrice(subscription.plan.price, subscription.plan.currency_code)}/${subscription.plan.billing_interval}`
                : ""}
            </p>
          </div>
        </div>
        <span className={status.className}>{status.label}</span>
      </div>

      <div className="enterprise-card-body">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-500">Started: </span>
              <span className="text-slate-900">
                {formatDate(subscription.current_period_start)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ArrowPath className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-500">Renews: </span>
              <span className="text-slate-900">
                {formatDate(subscription.next_billing_date)}
              </span>
            </div>
          </div>
        </div>

        {subscription.status === "trialing" && subscription.trial_end && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-700">
              Your trial ends on{" "}
              <strong>{formatDate(subscription.trial_end)}</strong>. You won't be
              charged until then.
            </p>
          </div>
        )}

        {subscription.status === "paused" && subscription.pause_end && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-amber-700">
              Subscription paused. Will resume on{" "}
              <strong>{formatDate(subscription.pause_end)}</strong>.
            </p>
          </div>
        )}

        {subscription.status === "past_due" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-red-700">
              Payment failed. Please update your payment method to continue your
              subscription.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <a
            href={`${prefix}/account/subscriptions/${subscription.id}`}
            className="btn-enterprise-secondary"
          >
            View Details
          </a>

          {subscription.status === "active" && onPause && (
            <button
              onClick={() => onPause(subscription.id)}
              className="btn-enterprise-ghost"
            >
              <PauseSolid className="w-4 h-4" />
              Pause
            </button>
          )}

          {subscription.status === "paused" && onResume && (
            <button
              onClick={() => onResume(subscription.id)}
              className="btn-enterprise-success"
            >
              <PlaySolid className="w-4 h-4" />
              Resume
            </button>
          )}

          {["active", "trialing", "paused"].includes(subscription.status) &&
            onCancel && (
              <button
                onClick={() => onCancel(subscription.id)}
                className="btn-enterprise-ghost text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            )}
        </div>
      </div>
    </div>
  )
}

export function SubscriptionEmptyState() {
  const prefix = useTenantPrefix()

  return (
    <div className="empty-state">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <CreditCard className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="empty-state-title">No active subscriptions</h3>
      <p className="empty-state-description">
        Subscribe to a plan to unlock premium features and benefits.
      </p>
      <a
        href={`${prefix}/subscriptions`}
        className="btn-enterprise-primary mt-6"
      >
        View Plans
      </a>
    </div>
  )
}
