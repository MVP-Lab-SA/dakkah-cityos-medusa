import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/warranties/")({
  component: WarrantiesPage,
})

function WarrantiesPage() {
  const { tenant, locale } = Route.useParams()
  const [plans, setPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/warranties")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data.warranties || data.plans || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Warranty Plans</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Protect your purchases with comprehensive warranty coverage. Choose the plan that gives you peace of mind.
          </p>
        </div>
      </section>

      <div className="content-container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No warranty plans available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Link
                key={plan.id}
                to={`/${tenant}/${locale}/warranties/${plan.id}` as any}
                className="bg-white rounded-lg border border-zinc-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-zinc-900 text-lg mb-2">{plan.name || plan.title || plan.plan_name}</h3>
                {plan.coverage && (
                  <p className="text-sm text-zinc-500 mb-2">Coverage: {plan.coverage}</p>
                )}
                {plan.duration && (
                  <p className="text-sm text-zinc-400 mb-3">Duration: {plan.duration}</p>
                )}
                {plan.price != null && (
                  <p className="text-lg font-bold text-zinc-900">
                    ${Number(plan.price).toFixed(2)}
                  </p>
                )}
                {plan.description && (
                  <p className="text-sm text-zinc-500 mt-3 line-clamp-2">{plan.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
