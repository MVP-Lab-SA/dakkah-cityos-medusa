import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/warranties/$id")({
  component: WarrantyDetailPage,
})

function WarrantyDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [plan, setPlan] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/warranties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlan(data.warranty || data.plan || data.item || data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Warranty plan not found</p>
          <Link to={`/${tenant}/${locale}/warranties` as any} className="text-sm font-medium text-zinc-900 hover:underline">
            Back to warranty plans
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link to={`/${tenant}/${locale}/warranties` as any} className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6">
            ← Back to warranty plans
          </Link>
          <h1 className="text-3xl font-bold">{plan.name || plan.title || plan.plan_name}</h1>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {plan.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Plan Overview</h2>
                <p className="text-zinc-600 leading-relaxed">{plan.description}</p>
              </div>
            )}
            {plan.terms && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Terms & Conditions</h2>
                <p className="text-zinc-600 leading-relaxed">{plan.terms}</p>
              </div>
            )}
            {plan.exclusions && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Exclusions</h2>
                <p className="text-zinc-600 leading-relaxed">{plan.exclusions}</p>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Plan Details</h3>
              <dl className="space-y-3">
                {plan.price != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Price</dt>
                    <dd className="text-2xl font-bold text-zinc-900">${Number(plan.price).toFixed(2)}</dd>
                  </div>
                )}
                {plan.coverage && (
                  <div>
                    <dt className="text-sm text-zinc-400">Coverage</dt>
                    <dd className="text-zinc-900 font-medium">{plan.coverage}</dd>
                  </div>
                )}
                {plan.duration && (
                  <div>
                    <dt className="text-sm text-zinc-400">Duration</dt>
                    <dd className="text-zinc-900 font-medium">{plan.duration}</dd>
                  </div>
                )}
                {plan.deductible != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Deductible</dt>
                    <dd className="text-zinc-900 font-medium">${Number(plan.deductible).toFixed(2)}</dd>
                  </div>
                )}
              </dl>
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors mt-6">
                Purchase Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
