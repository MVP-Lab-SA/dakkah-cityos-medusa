// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { normalizeItem } from "@/lib/utils/normalize-item"

export const Route = createFileRoute("/$tenant/$locale/trade-in/$id")({
  component: TradeInDetailPage,
})

function TradeInDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const prefix = `/${tenant}/${locale}`

  const { data: item, isLoading, error } = useQuery({
    queryKey: ["trade-in", id],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ item: any }>(
        `/store/trade-ins/${id}`,
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

  if (error || !item) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-ds-foreground mb-2">Trade-In Item Not Found</h2>
            <p className="text-ds-muted-foreground mb-6">This trade-in item may have been removed or is no longer available.</p>
            <Link to={`${prefix}/trade-in` as any} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:bg-ds-primary/90 transition-colors">
              Browse Trade-Ins
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const conditionColors: Record<string, string> = {
    excellent: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800",
    fair: "bg-yellow-100 text-yellow-800",
    poor: "bg-red-100 text-red-800",
  }

  const conditionClass = conditionColors[(item.condition || "").toLowerCase()] || "bg-ds-muted text-ds-muted-foreground"

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`${prefix}/trade-in` as any} className="hover:text-ds-foreground transition-colors">Trade-In</Link>
            <span>/</span>
            <span className="text-ds-foreground truncate">{item.title || item.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/9] bg-ds-muted rounded-xl overflow-hidden">
              {item.thumbnail || item.image ? (
                <img src={item.thumbnail || item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-ds-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              )}
              {item.category && (
                <span className="absolute top-4 start-4 px-3 py-1 text-xs font-semibold rounded-full bg-ds-primary text-ds-primary-foreground">
                  {item.category}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ds-foreground">{item.title || item.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {item.condition && (
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${conditionClass}`}>
                    Condition: {item.condition}
                  </span>
                )}
                {item.brand && (
                  <span className="text-sm text-ds-muted-foreground">Brand: {item.brand}</span>
                )}
              </div>
            </div>

            {item.description && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Description</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{item.description}</p>
              </div>
            )}

            {item.condition_details && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Condition Assessment</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{item.condition_details}</p>
              </div>
            )}

            {item.requirements && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Trade-In Requirements</h2>
                {Array.isArray(item.requirements) ? (
                  <ul className="space-y-2">
                    {item.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-ds-muted-foreground">
                        <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {req}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{item.requirements}</p>
                )}
              </div>
            )}

            {(item.metadata || item.details) && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Item Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(item.metadata || item.details || {}).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-ds-muted-foreground">{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                      <p className="font-medium text-ds-foreground">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="sticky top-4 space-y-6">
              <div className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-ds-muted-foreground">Offered Trade-In Value</p>
                  <p className="text-3xl font-bold text-ds-success">
                    {item.offered_value != null || item.trade_in_value != null
                      ? `$${Number(item.offered_value || item.trade_in_value).toLocaleString()}`
                      : "Get a Quote"}
                  </p>
                  {item.original_price && (
                    <p className="text-sm text-ds-muted-foreground mt-1">
                      Original: <span className="line-through">${Number(item.original_price).toLocaleString()}</span>
                    </p>
                  )}
                </div>

                <button className="w-full py-3 px-4 bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Start Trade-In
                </button>

                <button className="w-full py-3 px-4 border border-ds-border text-ds-foreground rounded-lg font-medium hover:bg-ds-muted transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Get Quote
                </button>
              </div>

              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h3 className="font-semibold text-ds-foreground mb-3">How Trade-In Works</h3>
                <ul className="space-y-3 text-sm text-ds-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-ds-primary/10 text-ds-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    Submit your item for evaluation
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-ds-primary/10 text-ds-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    Receive a trade-in value offer
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-ds-primary/10 text-ds-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    Ship your item or drop it off
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-ds-primary/10 text-ds-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                    Get credit or payment
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
