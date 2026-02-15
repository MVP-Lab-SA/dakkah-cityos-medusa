// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { normalizeItem } from "@/lib/utils/normalize-item"

export const Route = createFileRoute("/$tenant/$locale/crowdfunding/$id")({
  component: CrowdfundingDetailPage,
})

function CrowdfundingDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const prefix = `/${tenant}/${locale}`

  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ["crowdfunding", id],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ item: any }>(
        `/store/crowdfunding/${id}`,
        { method: "GET", credentials: "include" }
      )
      return normalizeItem(response.item || response)
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-6 w-48 bg-ds-muted rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-[16/9] bg-ds-muted rounded-xl animate-pulse" />
              <div className="h-8 w-3/4 bg-ds-muted rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-ds-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-ds-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-ds-muted rounded-xl animate-pulse" />
              <div className="h-48 bg-ds-muted rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-ds-foreground mb-2">Campaign Not Found</h2>
            <p className="text-ds-muted-foreground mb-6">This campaign may have been removed or is no longer available.</p>
            <Link to={`${prefix}/crowdfunding` as any} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:bg-ds-primary/90 transition-colors">
              Browse Campaigns
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const goal = Number(campaign.goal || 0)
  const raised = Number(campaign.raised || campaign.amount_raised || 0)
  const progressPercent = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`${prefix}/crowdfunding` as any} className="hover:text-ds-foreground transition-colors">Crowdfunding</Link>
            <span>/</span>
            <span className="text-ds-foreground truncate">{campaign.title || campaign.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/9] bg-ds-muted rounded-xl overflow-hidden">
              {campaign.thumbnail || campaign.image ? (
                <img src={campaign.thumbnail || campaign.image} alt={campaign.title || campaign.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-ds-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {campaign.category && (
                <span className="absolute top-4 start-4 px-3 py-1 text-xs font-semibold rounded-full bg-ds-background/80 text-ds-foreground backdrop-blur-sm">{campaign.category}</span>
              )}
              {campaign.status && (
                <span className={`absolute top-4 end-4 px-3 py-1 text-xs font-semibold rounded-full ${campaign.status === "active" ? "bg-ds-success/20 text-ds-success" : "bg-ds-muted text-ds-muted-foreground"}`}>
                  {campaign.status}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ds-foreground">{campaign.title || campaign.name}</h1>
              {campaign.creator && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-8 h-8 bg-ds-primary/10 rounded-full flex items-center justify-center text-ds-primary text-sm font-semibold">
                    {(typeof campaign.creator === "string" ? campaign.creator : campaign.creator.name || "C").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-ds-muted-foreground">by {typeof campaign.creator === "string" ? campaign.creator : campaign.creator.name}</span>
                </div>
              )}
            </div>

            <div className="bg-ds-background border border-ds-border rounded-xl p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ds-muted-foreground">Progress</span>
                  <span className="font-medium text-ds-foreground">{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-ds-muted rounded-full overflow-hidden">
                  <div className="h-full bg-ds-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-ds-foreground">${raised.toLocaleString()}</p>
                    <p className="text-xs text-ds-muted-foreground">raised of ${goal.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-ds-foreground">{campaign.backers_count || campaign.backers || 0}</p>
                    <p className="text-xs text-ds-muted-foreground">backers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-ds-foreground">{campaign.days_remaining || campaign.days_left || 0}</p>
                    <p className="text-xs text-ds-muted-foreground">days left</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="block lg:hidden">
              <div className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-4">
                <button className="w-full py-3 px-4 bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90 transition-colors">
                  Back This Campaign
                </button>
              </div>
            </div>

            {campaign.description && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">About This Campaign</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
              </div>
            )}

            {campaign.reward_tiers && campaign.reward_tiers.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-4">Reward Tiers</h2>
                <div className="space-y-4">
                  {campaign.reward_tiers.map((tier: any, idx: number) => (
                    <div key={idx} className="p-4 border border-ds-border rounded-lg hover:border-ds-primary transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-ds-foreground">{typeof tier === "string" ? tier : tier.name || tier.title}</h3>
                        {tier.amount != null && <p className="font-bold text-ds-primary text-lg">${Number(tier.amount).toLocaleString()}</p>}
                      </div>
                      {tier.description && <p className="text-sm text-ds-muted-foreground mb-2">{tier.description}</p>}
                      {tier.includes && tier.includes.length > 0 && (
                        <div className="space-y-1">
                          {tier.includes.map((item: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-ds-muted-foreground">
                              <svg className="w-3 h-3 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                      {tier.backers_count != null && (
                        <p className="text-xs text-ds-muted-foreground mt-2">{tier.backers_count} backers</p>
                      )}
                      <button className="mt-3 w-full py-2 px-3 text-sm bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90 transition-colors">
                        Pledge ${Number(tier.amount || 0).toLocaleString()}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {campaign.updates && campaign.updates.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-4">Updates</h2>
                <div className="space-y-4">
                  {campaign.updates.map((update: any, idx: number) => (
                    <div key={idx} className="pb-4 border-b border-ds-border last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-ds-foreground">{typeof update === "string" ? `Update #${idx + 1}` : update.title}</span>
                        {update.date && <span className="text-xs text-ds-muted-foreground">{update.date}</span>}
                      </div>
                      <p className="text-sm text-ds-muted-foreground">{typeof update === "string" ? update : update.content || update.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:block space-y-6">
            <div className="sticky top-4 space-y-6">
              <div className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-ds-primary">${raised.toLocaleString()}</p>
                  <p className="text-sm text-ds-muted-foreground">raised of ${goal.toLocaleString()} goal</p>
                </div>

                <button className="w-full py-3 px-4 bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90 transition-colors">
                  Back This Campaign
                </button>

                <button className="w-full py-3 px-4 border border-ds-border text-ds-foreground rounded-lg font-medium hover:bg-ds-muted transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share
                </button>
              </div>

              {campaign.creator && typeof campaign.creator === "object" && (
                <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                  <h3 className="font-semibold text-ds-foreground mb-3">Creator</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ds-primary/10 rounded-full flex items-center justify-center text-ds-primary font-semibold">
                      {(campaign.creator.name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-ds-foreground text-sm">{campaign.creator.name}</p>
                      {campaign.creator.campaigns_count && (
                        <p className="text-xs text-ds-muted-foreground">{campaign.creator.campaigns_count} campaigns</p>
                      )}
                    </div>
                  </div>
                  {campaign.creator.bio && (
                    <p className="text-sm text-ds-muted-foreground mt-3">{campaign.creator.bio}</p>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
