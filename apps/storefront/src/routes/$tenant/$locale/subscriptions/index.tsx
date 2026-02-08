import { createFileRoute } from "@tanstack/react-router"
import { useSubscriptionPlans } from "@/lib/hooks/use-subscriptions"
import { PlanCard } from "@/components/subscriptions"
import { Spinner } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/subscriptions/")({
  component: SubscriptionPlansPage,
})

function SubscriptionPlansPage() {
  const { tenant, locale } = Route.useParams()
  const { data: plans, isLoading, error } = useSubscriptionPlans()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="content-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
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
              <Spinner className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600">Failed to load plans. Please try again.</p>
            </div>
          ) : plans && plans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  countryCode={locale}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500">No plans available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="content-container max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
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

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="content-container text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-slate-300 mb-8">
            Our team is here to help you find the perfect plan for your needs.
          </p>
          <a
            href="mailto:support@example.com"
            className="btn-enterprise bg-white text-slate-900 hover:bg-slate-100"
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
    <div className="border-b border-slate-200 pb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{question}</h3>
      <p className="text-slate-600">{answer}</p>
    </div>
  )
}
