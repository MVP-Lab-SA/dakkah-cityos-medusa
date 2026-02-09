import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/memberships/")({
  component: MembershipsPage,
})

function MembershipsPage() {
  const { tenant, locale } = Route.useParams()
  const [tiers, setTiers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/memberships")
      .then((res) => res.json())
      .then((data) => {
        setTiers(data.memberships || data.tiers || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Memberships</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Unlock exclusive benefits and perks. Choose the membership tier that fits your lifestyle.
          </p>
        </div>
      </section>

      <div className="content-container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : tiers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No membership tiers available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Link
                key={tier.id}
                to={`/${tenant}/${locale}/memberships/${tier.id}` as any}
                className="bg-white rounded-lg border border-zinc-200 p-6 hover:shadow-md transition-shadow relative"
              >
                {(tier.badge || tier.popular) && (
                  <span className="absolute top-4 right-4 bg-zinc-900 text-white text-xs font-medium px-2 py-1 rounded">
                    {tier.badge || "Popular"}
                  </span>
                )}
                <h3 className="font-semibold text-zinc-900 text-xl mb-2">{tier.name || tier.title || tier.tier_name}</h3>
                {tier.price != null && (
                  <p className="text-3xl font-bold text-zinc-900 mb-4">
                    ${Number(tier.price).toFixed(2)}<span className="text-sm font-normal text-zinc-400">/mo</span>
                  </p>
                )}
                {tier.benefits && (
                  <div className="mt-4">
                    <p className="text-sm text-zinc-600 line-clamp-3">{typeof tier.benefits === "string" ? tier.benefits : Array.isArray(tier.benefits) ? tier.benefits.join(", ") : ""}</p>
                  </div>
                )}
                {tier.description && (
                  <p className="text-sm text-zinc-500 mt-3 line-clamp-2">{tier.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
