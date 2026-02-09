import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/affiliates/")({
  component: AffiliatesPage,
})

function AffiliatesPage() {
  const { tenant, locale } = Route.useParams()
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/affiliates")
      .then((res) => res.json())
      .then((data) => {
        setAffiliates(data.affiliates || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Affiliate Program</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Join our affiliate network and earn commissions by promoting products and services
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
        ) : affiliates.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No affiliates available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {affiliates.map((affiliate) => (
              <AffiliateCard key={affiliate.id} affiliate={affiliate} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AffiliateCard({ affiliate, tenant, locale }: { affiliate: any; tenant: string; locale: string }) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  return (
    <Link
      to={`/${tenant}/${locale}/affiliates/${affiliate.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-zinc-100 relative flex items-center justify-center">
        {(affiliate.logo || affiliate.image) ? (
          <img
            src={affiliate.logo || affiliate.image}
            alt={affiliate.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <p className="text-xs text-zinc-400">Affiliate</p>
          </div>
        )}
        {affiliate.status && (
          <span className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded ${getStatusColor(affiliate.status)}`}>
            {affiliate.status}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 text-lg">{affiliate.name}</h3>
        <div className="mt-4 space-y-2">
          {affiliate.commission_rate != null && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Commission Rate</p>
              <p className="font-medium text-zinc-900">
                {Number(affiliate.commission_rate).toFixed(1)}%
              </p>
            </div>
          )}
          {affiliate.total_earnings != null && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Total Earnings</p>
              <p className="text-sm font-medium text-zinc-700">
                ${Number(affiliate.total_earnings).toLocaleString()}
              </p>
            </div>
          )}
          {affiliate.referrals != null && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Referrals</p>
              <p className="text-sm font-medium text-zinc-700">{Number(affiliate.referrals).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
