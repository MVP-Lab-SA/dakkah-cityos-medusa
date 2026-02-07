
import { CheckCircleSolid } from "@medusajs/icons"
import type { SubscriptionPlan } from "../../lib/types/subscriptions"

interface PlanCardProps {
  plan: SubscriptionPlan
  countryCode: string
  isCurrentPlan?: boolean
}

export function PlanCard({ plan, countryCode, isCurrentPlan }: PlanCardProps) {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const intervalLabel = {
    monthly: "/month",
    yearly: "/year",
    quarterly: "/quarter",
    weekly: "/week",
  }

  return (
    <div
      className={`
        relative bg-white rounded-2xl border-2 transition-all duration-300
        ${
          plan.is_popular
            ? "border-slate-900 shadow-xl scale-[1.02]"
            : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
        }
        ${isCurrentPlan ? "ring-2 ring-emerald-500 ring-offset-2" : ""}
      `}
    >
      {/* Popular Badge */}
      {plan.is_popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
            Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="inline-flex items-center px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
            Current Plan
          </span>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {plan.name}
          </h3>
          <p className="text-sm text-slate-500">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-slate-900">
              {formatPrice(plan.price, plan.currency_code)}
            </span>
            <span className="text-slate-500 text-lg">
              {intervalLabel[plan.billing_interval]}
            </span>
          </div>
          {plan.trial_days && (
            <p className="text-sm text-emerald-600 font-medium mt-2">
              {plan.trial_days}-day free trial
            </p>
          )}
          {plan.setup_fee && (
            <p className="text-xs text-slate-400 mt-1">
              + {formatPrice(plan.setup_fee, plan.currency_code)} setup fee
            </p>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircleSolid className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {isCurrentPlan ? (
          <button
            disabled
            className="w-full py-3 px-6 rounded-xl bg-slate-100 text-slate-400 font-medium cursor-not-allowed"
          >
            Current Plan
          </button>
        ) : (
          <a
            href={`/${countryCode}/subscriptions/checkout?plan=${plan.handle}`}
            className={`
              w-full py-3 px-6 rounded-xl font-medium text-center block transition-all duration-200
              ${
                plan.is_popular
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white"
              }
            `}
          >
            {plan.trial_days ? "Start Free Trial" : "Get Started"}
          </a>
        )}
      </div>
    </div>
  )
}

interface PlanComparisonTableProps {
  plans: SubscriptionPlan[]
  countryCode: string
}

export function PlanComparisonTable({
  plans,
  countryCode,
}: PlanComparisonTableProps) {
  // Get all unique features across all plans
  const allFeatures = Array.from(
    new Set(plans.flatMap((plan) => plan.features))
  )

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
              Features
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                className={`text-center py-4 px-4 ${plan.is_popular ? "bg-slate-50" : ""}`}
              >
                <div className="font-semibold text-slate-900">{plan.name}</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {formatPrice(plan.price, plan.currency_code)}
                  <span className="text-sm font-normal text-slate-500">
                    /mo
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {allFeatures.map((feature, index) => (
            <tr key={index}>
              <td className="py-3 px-4 text-sm text-slate-600">{feature}</td>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  className={`py-3 px-4 text-center ${plan.is_popular ? "bg-slate-50" : ""}`}
                >
                  {plan.features.includes(feature) ? (
                    <CheckCircleSolid className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-200">
            <td className="py-6 px-4"></td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`py-6 px-4 text-center ${plan.is_popular ? "bg-slate-50" : ""}`}
              >
                <a
                  href={`/${countryCode}/subscriptions/checkout?plan=${plan.handle}`}
                  className={`
                    inline-flex items-center justify-center py-2.5 px-6 rounded-lg font-medium transition-all duration-200
                    ${
                      plan.is_popular
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50"
                    }
                  `}
                >
                  Choose Plan
                </a>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
