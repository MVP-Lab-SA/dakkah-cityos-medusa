import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/advertising/$id")({
  component: AdvertisingDetailPage,
})

function AdvertisingDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [campaign, setCampaign] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/advertising/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCampaign(data.advertising || data.campaign || data.item || data)
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

  if (!campaign) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Campaign not found</p>
          <Link
            to={`/${tenant}/${locale}/advertising` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to advertising
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-600/20 text-green-300"
      case "paused":
        return "bg-yellow-600/20 text-yellow-300"
      case "ended":
        return "bg-red-600/20 text-red-300"
      default:
        return "bg-zinc-600/20 text-zinc-300"
    }
  }

  const ctr = campaign.impressions && campaign.clicks ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : null

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link
            to={`/${tenant}/${locale}/advertising` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to advertising
          </Link>
          <h1 className="text-3xl font-bold">{campaign.campaign_name || campaign.name}</h1>
          {campaign.status && (
            <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm ${getStatusColor(campaign.status)}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {campaign.status}
            </div>
          )}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {(campaign.thumbnail || campaign.image) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img
                  src={campaign.thumbnail || campaign.image}
                  alt={campaign.campaign_name || campaign.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {campaign.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Campaign Description</h2>
                <p className="text-zinc-600 leading-relaxed">{campaign.description}</p>
              </div>
            )}

            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {campaign.budget != null && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Budget</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">
                      ${Number(campaign.budget).toLocaleString()}
                    </p>
                  </div>
                )}
                {campaign.impressions != null && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Impressions</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">
                      {Number(campaign.impressions).toLocaleString()}
                    </p>
                  </div>
                )}
                {campaign.clicks != null && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Clicks</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">
                      {Number(campaign.clicks).toLocaleString()}
                    </p>
                  </div>
                )}
                {ctr && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">CTR</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">{ctr}%</p>
                  </div>
                )}
                {campaign.spend != null && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Spent</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">
                      ${Number(campaign.spend).toLocaleString()}
                    </p>
                  </div>
                )}
                {campaign.conversions != null && (
                  <div>
                    <p className="text-xs text-zinc-400 uppercase">Conversions</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2">
                      {Number(campaign.conversions).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {campaign.placements && campaign.placements.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Ad Placements</h2>
                <div className="space-y-3">
                  {campaign.placements.map((placement: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-zinc-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-zinc-900">{placement.name || placement.location || `Placement ${i + 1}`}</p>
                        {placement.type && (
                          <p className="text-xs text-zinc-400 mt-1">{placement.type}</p>
                        )}
                      </div>
                      {placement.status && (
                        <span className="text-xs font-medium px-2 py-1 bg-zinc-100 text-zinc-700 rounded">
                          {placement.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-6">Campaign Details</h3>

              {campaign.start_date && (
                <div className="mb-4 pb-4 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase">Start Date</p>
                  <p className="font-medium text-zinc-900 mt-1">
                    {new Date(campaign.start_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {campaign.end_date && (
                <div className="mb-4 pb-4 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase">End Date</p>
                  <p className="font-medium text-zinc-900 mt-1">
                    {new Date(campaign.end_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {campaign.target_audience && (
                <div className="mb-4 pb-4 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase">Target Audience</p>
                  <p className="font-medium text-zinc-900 mt-1">{campaign.target_audience}</p>
                </div>
              )}

              {campaign.advertiser && (
                <div className="mb-4 pb-4 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase">Advertiser</p>
                  <p className="font-medium text-zinc-900 mt-1">{campaign.advertiser.name || campaign.advertiser}</p>
                </div>
              )}

              {campaign.contact_email && (
                <div className="mb-6">
                  <p className="text-xs text-zinc-400 uppercase">Contact</p>
                  <p className="text-sm text-zinc-600 mt-1">{campaign.contact_email}</p>
                </div>
              )}

              {campaign.status?.toLowerCase() === "active" && (
                <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                  Inquire About This Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
