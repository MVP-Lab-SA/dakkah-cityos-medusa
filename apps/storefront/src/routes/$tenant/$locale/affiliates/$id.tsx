import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/affiliates/$id")({
  component: AffiliateDetailPage,
})

function AffiliateDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [affiliate, setAffiliate] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/affiliates/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAffiliate(data.affiliate || data.item || data)
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

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Affiliate profile not found</p>
          <Link
            to={`/${tenant}/${locale}/affiliates` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to affiliates
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-600/20 text-green-300"
      case "pending":
        return "bg-yellow-600/20 text-yellow-300"
      case "inactive":
        return "bg-red-600/20 text-red-300"
      default:
        return "bg-zinc-600/20 text-zinc-300"
    }
  }

  const conversionRate = affiliate.conversions && affiliate.referrals ? ((affiliate.conversions / affiliate.referrals) * 100).toFixed(2) : null

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link
            to={`/${tenant}/${locale}/affiliates` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to affiliates
          </Link>
          <div className="flex items-start gap-4">
            {(affiliate.logo || affiliate.image) && (
              <img
                src={affiliate.logo || affiliate.image}
                alt={affiliate.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{affiliate.name}</h1>
              {affiliate.status && (
                <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm ${getStatusColor(affiliate.status)}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {affiliate.status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {affiliate.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About</h2>
                <p className="text-zinc-600 leading-relaxed">{affiliate.description}</p>
              </div>
            )}

            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Earnings Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {affiliate.total_earnings != null && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Total Earnings</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">
                      ${Number(affiliate.total_earnings).toLocaleString()}
                    </p>
                  </div>
                )}
                {affiliate.pending_earnings != null && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Pending</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">
                      ${Number(affiliate.pending_earnings).toLocaleString()}
                    </p>
                  </div>
                )}
                {affiliate.commission_rate != null && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Commission Rate</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">
                      {Number(affiliate.commission_rate).toFixed(1)}%
                    </p>
                  </div>
                )}
                {affiliate.referrals != null && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Total Referrals</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">
                      {Number(affiliate.referrals).toLocaleString()}
                    </p>
                  </div>
                )}
                {affiliate.conversions != null && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Conversions</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">
                      {Number(affiliate.conversions).toLocaleString()}
                    </p>
                  </div>
                )}
                {conversionRate && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Conversion Rate</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">{conversionRate}%</p>
                  </div>
                )}
              </div>
            </div>

            {affiliate.referral_links && affiliate.referral_links.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Referral Links</h2>
                <div className="space-y-3">
                  {affiliate.referral_links.map((link: any, i: number) => (
                    <div key={i} className="p-4 bg-zinc-50 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-900 break-all text-sm">{link.url || link.link}</p>
                          {link.created_at && (
                            <p className="text-xs text-zinc-400 mt-1">
                              Created {new Date(link.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {link.clicks != null && (
                          <div className="text-right">
                            <p className="text-xs text-zinc-400">Clicks</p>
                            <p className="font-medium text-zinc-900">{Number(link.clicks).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {affiliate.transactions && affiliate.transactions.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                  Recent Transactions ({affiliate.transactions.length})
                </h2>
                <div className="divide-y divide-zinc-100">
                  {affiliate.transactions.slice(0, 10).map((transaction: any, i: number) => (
                    <div key={i} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900">{transaction.description || `Transaction ${i + 1}`}</p>
                        {transaction.date && (
                          <p className="text-xs text-zinc-400 mt-1">
                            {new Date(transaction.date).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${Number(transaction.amount) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Number(transaction.amount) > 0 ? '+' : ''} ${Math.abs(Number(transaction.amount)).toLocaleString()}
                        </p>
                        {transaction.status && (
                          <p className="text-xs text-zinc-400 mt-1">{transaction.status}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-6">Profile Information</h3>

              {affiliate.email && (
                <div className="mb-4 pb-4 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase">Email</p>
                  <p className="text-sm text-zinc-600 mt-1">{affiliate.email}</p>
                </div>
              )}

              {affiliate.phone && (
                <div className="mb-4 pb-4 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase">Phone</p>
                  <p className="text-sm text-zinc-600 mt-1">{affiliate.phone}</p>
                </div>
              )}

              {affiliate.website && (
                <div className="mb-4 pb-4 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase">Website</p>
                  <a
                    href={affiliate.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-1"
                  >
                    {affiliate.website}
                  </a>
                </div>
              )}

              {affiliate.joined_date && (
                <div className="mb-4 pb-4 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase">Joined</p>
                  <p className="font-medium text-zinc-900 mt-1">
                    {new Date(affiliate.joined_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {affiliate.last_activity && (
                <div className="mb-6 pb-4 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase">Last Activity</p>
                  <p className="font-medium text-zinc-900 mt-1">
                    {new Date(affiliate.last_activity).toLocaleDateString()}
                  </p>
                </div>
              )}

              {affiliate.status?.toLowerCase() === "active" && (
                <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                  Contact Affiliate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
