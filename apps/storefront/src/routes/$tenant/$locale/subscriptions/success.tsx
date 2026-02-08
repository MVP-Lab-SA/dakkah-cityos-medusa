import { createFileRoute } from "@tanstack/react-router"
import { CheckCircleSolid } from "@medusajs/icons"
import { useSubscriptionPlan } from "@/lib/hooks/use-subscriptions"

export const Route = createFileRoute("/$tenant/$locale/subscriptions/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan: (search.plan as string) || "",
  }),
  component: SubscriptionSuccessPage,
})

function SubscriptionSuccessPage() {
  const { tenant, locale } = Route.useParams()
  const { plan: planHandle } = Route.useSearch()
  const { data: plan } = useSubscriptionPlan(planHandle)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
      <div className="content-container max-w-lg text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircleSolid className="w-10 h-10 text-emerald-600" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Welcome to {plan?.name || "Your Plan"}!
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-8">
          {plan?.trial_days
            ? `Your ${plan.trial_days}-day free trial has started. Explore all the premium features!`
            : "Your subscription is now active. Explore all the premium features!"}
        </p>

        {/* Trial Info Card */}
        {plan?.trial_days && (
          <div className="enterprise-card mb-8">
            <div className="enterprise-card-body">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-sm text-slate-500">Trial Ends</div>
                  <div className="font-semibold text-slate-900">
                    {new Date(
                      Date.now() + plan.trial_days * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Status</div>
                  <div className="badge-primary">Trial Active</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="enterprise-card text-left mb-8">
          <div className="enterprise-card-header">
            <h2 className="font-semibold text-slate-900">Next Steps</h2>
          </div>
          <div className="enterprise-card-body">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    Complete Your Profile
                  </div>
                  <div className="text-sm text-slate-500">
                    Add your business details and preferences
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    Explore Features
                  </div>
                  <div className="text-sm text-slate-500">
                    Discover all the tools available in your plan
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    Invite Your Team
                  </div>
                  <div className="text-sm text-slate-500">
                    Add team members to collaborate together
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`/${tenant}/${locale}/account/subscriptions`}
            className="btn-enterprise-primary"
          >
            Manage Subscription
          </a>
          <a href={`/${tenant}/${locale}`} className="btn-enterprise-secondary">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  )
}
