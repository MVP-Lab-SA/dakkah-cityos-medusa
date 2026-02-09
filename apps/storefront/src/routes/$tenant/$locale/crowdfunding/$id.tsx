import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/crowdfunding/$id")({
  component: CrowdfundingDetailPage,
})

function CrowdfundingDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [campaign, setCampaign] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/crowdfunding/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCampaign(data.campaign || data.crowdfunding || data.item || data)
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
          <Link to={`/${tenant}/${locale}/crowdfunding` as any} className="text-sm font-medium text-zinc-900 hover:underline">
            Back to campaigns
          </Link>
        </div>
      </div>
    )
  }

  const goal = Number(campaign.goal || campaign.target || 0)
  const raised = Number(campaign.raised || campaign.amount_raised || 0)
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link to={`/${tenant}/${locale}/crowdfunding` as any} className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6">
            ← Back to campaigns
          </Link>
          <h1 className="text-3xl font-bold">{campaign.title || campaign.name}</h1>
          {campaign.creator && <p className="text-zinc-300 mt-2">by {campaign.creator}</p>}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {(campaign.image || campaign.thumbnail) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img src={campaign.image || campaign.thumbnail} alt={campaign.title || campaign.name} className="w-full h-full object-cover" />
              </div>
            )}
            {campaign.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About This Campaign</h2>
                <p className="text-zinc-600 leading-relaxed">{campaign.description}</p>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <div className="mb-6">
                <p className="text-3xl font-bold text-zinc-900">${raised.toLocaleString()}</p>
                <p className="text-sm text-zinc-400">raised of ${goal.toLocaleString()} goal</p>
                <div className="w-full bg-zinc-100 rounded-full h-3 mt-3">
                  <div className="bg-zinc-900 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-sm font-medium text-zinc-700 mt-2">{progress.toFixed(0)}% funded</p>
              </div>
              {campaign.backers_count != null && (
                <p className="text-sm text-zinc-500 mb-4">{campaign.backers_count} backers</p>
              )}
              {campaign.end_date && (
                <p className="text-sm text-zinc-500 mb-4">
                  Ends {new Date(campaign.end_date).toLocaleDateString()}
                </p>
              )}
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                Back This Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
