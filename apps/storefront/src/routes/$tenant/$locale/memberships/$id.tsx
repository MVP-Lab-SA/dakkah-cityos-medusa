import { createFileRoute, Link } from "@tanstack/react-router"
import { t, formatCurrency } from "@/lib/i18n"
import type { SupportedLocale } from "@/lib/i18n"
import { useMembership, useUserMembership } from "@/lib/hooks/use-memberships"
import { BenefitsList } from "@/components/memberships/benefits-list"

export const Route = createFileRoute("/$tenant/$locale/memberships/$id")({
  component: MembershipDetailPage,
})

const billingLabels: Record<string, string> = {
  monthly: "blocks.per_month",
  yearly: "blocks.per_year",
  lifetime: "membership.lifetime",
}

function MembershipDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const loc = locale as SupportedLocale

  const { data: tier, isLoading, error } = useMembership(id)
  const { data: userMembership } = useUserMembership()

  const isCurrent = userMembership?.tierId === id

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-6 w-48 bg-ds-muted rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="h-10 w-3/4 bg-ds-muted rounded animate-pulse" />
              <div className="h-6 w-1/2 bg-ds-muted rounded animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-5 w-full bg-ds-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-64 bg-ds-muted rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !tier) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg
              className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-ds-foreground mb-2">
              {t(locale, "common.not_found")}
            </h2>
            <p className="text-ds-muted-foreground mb-6">
              {t(locale, "membership.title")}
            </p>
            <Link
              to={`${prefix}/memberships` as any}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary/90 transition-colors"
            >
              {t(locale, "membership.browse_plans")}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-8">
          <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">
            {t(locale, "common.home")}
          </Link>
          <span>/</span>
          <Link to={`${prefix}/memberships` as any} className="hover:text-ds-foreground transition-colors">
            {t(locale, "membership.title")}
          </Link>
          <span>/</span>
          <span className="text-ds-foreground">{tier.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-ds-foreground">{tier.name}</h1>
                {tier.isPopular && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-ds-primary/20 text-ds-primary">
                    {t(locale, "blocks.most_popular")}
                  </span>
                )}
              </div>
              {tier.description && (
                <p className="text-ds-muted-foreground">{tier.description}</p>
              )}
            </div>

            <div className="bg-ds-background border border-ds-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-ds-foreground mb-4">
                {t(locale, "membership.benefits")}
              </h2>
              <BenefitsList benefits={tier.benefits} showAll variant="grid" />
            </div>

            {tier.trialDays && !isCurrent && (
              <div className="bg-ds-primary/5 border border-ds-primary/20 rounded-xl p-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-ds-foreground">
                  Start with a {tier.trialDays}-day free trial. Cancel anytime.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-ds-background border border-ds-border rounded-xl p-6 sticky top-4 space-y-6">
              <div className="text-center">
                <span className="text-4xl font-bold text-ds-foreground">
                  {formatCurrency(tier.price.amount, tier.price.currencyCode, loc)}
                </span>
                <span className="text-ds-muted-foreground ms-1">
                  {t(locale, billingLabels[tier.billingPeriod] || "blocks.per_month")}
                </span>
              </div>

              {isCurrent ? (
                <>
                  <div className="px-4 py-3 rounded-lg bg-ds-success/10 border border-ds-success/20 text-center">
                    <span className="text-sm font-medium text-ds-success">
                      {t(locale, "membership.current_plan")}
                    </span>
                  </div>

                  {userMembership?.renewalDate && (
                    <p className="text-xs text-ds-muted-foreground text-center">
                      {t(locale, "membership.renew")}: {userMembership.renewalDate}
                    </p>
                  )}

                  <button className="w-full px-6 py-3 text-sm font-medium rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted transition-colors">
                    {t(locale, "membership.cancel_membership")}
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full px-6 py-3 text-sm font-semibold rounded-lg bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary/90 transition-colors">
                    {userMembership ? t(locale, "membership.upgrade") : t(locale, "blocks.get_started")}
                  </button>

                  <Link
                    to={`${prefix}/memberships` as any}
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-ds-muted-foreground hover:text-ds-foreground transition-colors"
                  >
                    {t(locale, "membership.compare_plans")}
                  </Link>
                </>
              )}

              <div className="border-t border-ds-border pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
                  <svg className="w-4 h-4 text-ds-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
                  <svg className="w-4 h-4 text-ds-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
                  <svg className="w-4 h-4 text-ds-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Instant access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
