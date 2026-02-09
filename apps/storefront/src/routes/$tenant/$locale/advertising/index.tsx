import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/advertising/")({
  component: AdvertisingPage,
})

function AdvertisingPage() {
  const { tenant, locale } = Route.useParams()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/advertising")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.advertising || data.campaigns || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Advertising Opportunities</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Promote your brand with targeted ad placements across the CityOS network
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
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No advertising campaigns available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <AdvertisingCard key={campaign.id} campaign={campaign} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AdvertisingCard({ campaign, tenant, locale }: { campaign: any; tenant: string; locale: string }) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "ended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  return (
    <Link
      to={`/${tenant}/${locale}/advertising/${campaign.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-zinc-100 relative">
        {(campaign.thumbnail || campaign.image) ? (
          <img
            src={campaign.thumbnail || campaign.image}
            alt={campaign.campaign_name || campaign.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        )}
        {campaign.status && (
          <span className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded ${getStatusColor(campaign.status)}`}>
            {campaign.status}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 text-lg">{campaign.campaign_name || campaign.name}</h3>
        <div className="mt-4 space-y-2">
          {campaign.budget != null && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Budget</p>
              <p className="font-medium text-zinc-900">
                ${Number(campaign.budget).toLocaleString()}
              </p>
            </div>
          )}
          {campaign.impressions != null && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Impressions</p>
              <p className="text-sm font-medium text-zinc-700">{Number(campaign.impressions).toLocaleString()}</p>
            </div>
          )}
          {campaign.clicks != null && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Clicks</p>
              <p className="text-sm font-medium text-zinc-700">{Number(campaign.clicks).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
