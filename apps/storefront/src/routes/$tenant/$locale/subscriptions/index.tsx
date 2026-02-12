import { createFileRoute } from "@tanstack/react-router"
import { useSubscriptionPlans } from "@/lib/hooks/use-subscriptions"
import { PlanCard } from "@/components/subscriptions"
import { UpgradePrompt } from "@/components/freemium/upgrade-prompt"
import { Spinner } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/subscriptions/")({
  component: SubscriptionPlansPage,
})

function SubscriptionPlansPage() {
  const { tenant, locale } = Route.useParams()
  const { data: plans, isLoading, error } = useSubscriptionPlans()

  return (
    <div className="min-h-screen bg-ds-muted">
      {/* Hero Section */}
      <section className="bg-ds-primary text-ds-primary-foreground py-20">
        <div className="content-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-ds-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your business. All plans include a 14-day
            free trial with no credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 -mt-10">
        <div className="content-container">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="w-8 h-8 text-ds-muted-foreground animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-ds-destructive">Failed to load plans. Please try again.</p>
            </div>
          ) : plans && plans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-ds-muted-foreground">No plans available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-ds-background">
        <div className="content-container max-w-3xl">
          <h2 className="text-2xl font-bold text-ds-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FaqItem
              question="Can I change my plan later?"
              answer="Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle."
            />
            <FaqItem
              question="What happens when my trial ends?"
              answer="After your 14-day trial, you'll be automatically charged for your selected plan. You can cancel anytime before the trial ends."
            />
            <FaqItem
              question="Can I cancel my subscription?"
              answer="Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
            />
            <FaqItem
              question="Do you offer refunds?"
              answer="We offer a 30-day money-back guarantee on all plans. If you're not satisfied, contact our support team for a full refund."
            />
            <FaqItem
              question="Is there a setup fee?"
              answer="No, there are no setup fees for our Starter and Professional plans. The Enterprise plan may include custom setup based on your requirements."
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="content-container max-w-3xl">
          <UpgradePrompt
            locale={locale}
            featureName="Premium Features"
            variant="banner"
            benefits={[
              "Unlimited product listings",
              "Advanced analytics & reporting",
              "Priority customer support",
              "Custom branding options",
            ]}
            onUpgrade={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-ds-primary text-ds-primary-foreground">
        <div className="content-container text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-ds-muted-foreground mb-8">
            Our team is here to help you find the perfect plan for your needs.
          </p>
          <a
            href="mailto:support@dakkah.com"
            className="btn-enterprise bg-ds-background text-ds-foreground hover:bg-ds-muted"
          >
            Contact Sales
          </a>
        </div>
      </section>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-ds-border pb-6">
      <h3 className="text-lg font-semibold text-ds-foreground mb-2">{question}</h3>
      <p className="text-ds-muted-foreground">{answer}</p>
    </div>
  )
}
