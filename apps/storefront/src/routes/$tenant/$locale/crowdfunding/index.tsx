import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/crowdfunding/")({
  component: CrowdfundingPage,
})

function CrowdfundingPage() {
  const { tenant, locale } = Route.useParams()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/crowdfunding")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.campaigns || data.crowdfunding || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Crowdfunding</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Back innovative projects and ideas. Support creators and entrepreneurs bringing their visions to life.
          </p>
        </div>
      </section>

      <div className="content-container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <p className="text-zinc-500">No campaigns available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const goal = Number(campaign.goal || campaign.target || 0)
              const raised = Number(campaign.raised || campaign.amount_raised || 0)
              const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0

              return (
                <Link
                  key={campaign.id}
                  to={`/${tenant}/${locale}/crowdfunding/${campaign.id}` as any}
                  className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-zinc-100">
                    {(campaign.image || campaign.thumbnail) ? (
                      <img src={campaign.image || campaign.thumbnail} alt={campaign.title || campaign.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-zinc-900 text-lg mb-3">{campaign.title || campaign.name}</h3>
                    <div className="w-full bg-zinc-100 rounded-full h-2 mb-2">
                      <div className="bg-zinc-900 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-zinc-900">${raised.toLocaleString()} raised</span>
                      <span className="text-zinc-400">${goal.toLocaleString()} goal</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{progress.toFixed(0)}% funded</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
