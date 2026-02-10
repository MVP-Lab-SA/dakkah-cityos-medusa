import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { useMemberships, useUserMembership } from "@/lib/hooks/use-memberships"
import { TierCard } from "@/components/memberships/tier-card"
import { MembershipComparison } from "@/components/memberships/membership-comparison"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/memberships/")({
  component: MembershipsPage,
})

const faqItems = [
  {
    q: "membership.faq_cancel_q",
    a: "membership.faq_cancel_a",
  },
  {
    q: "membership.faq_switch_q",
    a: "membership.faq_switch_a",
  },
  {
    q: "membership.faq_refund_q",
    a: "membership.faq_refund_a",
  },
]

function MembershipsPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const { data: tiers, isLoading, error } = useMemberships()
  const { data: userMembership } = useUserMembership()

  const tiersWithCurrent = tiers?.map((tier) => ({
    ...tier,
    isCurrent: userMembership?.tierId === tier.id,
  }))

  const handleSelectTier = (tierId: string) => {
    window.location.href = `${prefix}/memberships/${tierId}`
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">
              {t(locale, "common.home")}
            </Link>
            <span>/</span>
            <span className="text-ds-foreground">{t(locale, "membership.title")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ds-foreground mb-3">
            {t(locale, "membership.browse_plans")}
          </h1>
          <p className="text-lg text-ds-muted-foreground max-w-2xl mx-auto">
            {t(locale, "membership.title")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="bg-ds-destructive/10 border border-ds-destructive/20 rounded-xl p-8 text-center">
            <svg
              className="w-12 h-12 text-ds-destructive mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-ds-destructive font-medium">
              Something went wrong loading memberships.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="h-6 w-1/2 bg-ds-muted rounded animate-pulse" />
                  <div className="h-10 w-3/4 bg-ds-muted rounded animate-pulse" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 w-full bg-ds-muted rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="h-12 w-full bg-ds-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : !tiersWithCurrent || tiersWithCurrent.length === 0 ? (
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
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">
              {t(locale, "membership.title")}
            </h3>
            <p className="text-ds-muted-foreground text-sm">
              No membership plans available at this time.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {tiersWithCurrent.map((tier) => (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  locale={locale}
                  prefix={prefix}
                  variant={tier.isPopular ? "featured" : "default"}
                  onSelect={handleSelectTier}
                />
              ))}
            </div>

            {tiersWithCurrent.length > 1 && (
              <div className="mb-16">
                <MembershipComparison
                  tiers={tiersWithCurrent}
                  locale={locale}
                  currentTierId={userMembership?.tierId}
                  onTierSelect={handleSelectTier}
                />
              </div>
            )}

            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-ds-foreground text-center mb-8">
                FAQ
              </h2>
              <div className="space-y-3">
                {faqItems.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-ds-background border border-ds-border rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-start"
                    >
                      <span className="text-sm font-medium text-ds-foreground">
                        {t(locale, faq.q)}
                      </span>
                      <svg
                        className={`w-5 h-5 text-ds-muted-foreground transition-transform flex-shrink-0 ${
                          expandedFaq === i ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedFaq === i && (
                      <div className="px-6 pb-4">
                        <p className="text-sm text-ds-muted-foreground">
                          {t(locale, faq.a)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
