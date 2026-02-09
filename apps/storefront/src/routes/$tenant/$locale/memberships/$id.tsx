import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/memberships/$id")({
  component: MembershipDetailPage,
})

function MembershipDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [tier, setTier] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/memberships/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTier(data.membership || data.tier || data.item || data)
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

  if (!tier) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Membership tier not found</p>
          <Link to={`/${tenant}/${locale}/memberships` as any} className="text-sm font-medium text-zinc-900 hover:underline">
            Back to memberships
          </Link>
        </div>
      </div>
    )
  }

  const benefits = tier.benefits
    ? typeof tier.benefits === "string"
      ? tier.benefits.split(",").map((b: string) => b.trim())
      : Array.isArray(tier.benefits)
        ? tier.benefits
        : []
    : []

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link to={`/${tenant}/${locale}/memberships` as any} className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6">
            ← Back to memberships
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{tier.name || tier.title || tier.tier_name}</h1>
            {tier.badge && (
              <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded">{tier.badge}</span>
            )}
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {tier.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About This Tier</h2>
                <p className="text-zinc-600 leading-relaxed">{tier.description}</p>
              </div>
            )}
            {benefits.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Benefits</h2>
                <ul className="space-y-3">
                  {benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span className="text-zinc-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <p className="text-sm text-zinc-400 uppercase">Price</p>
                {tier.price != null && (
                  <p className="text-3xl font-bold text-zinc-900 mt-1">
                    ${Number(tier.price).toFixed(2)}<span className="text-sm font-normal text-zinc-400">/mo</span>
                  </p>
                )}
              </div>
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
