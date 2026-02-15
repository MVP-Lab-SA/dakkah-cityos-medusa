// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { normalizeItem } from "@/lib/utils/normalize-item"

export const Route = createFileRoute("/$tenant/$locale/bundles/$id")({
  component: BundleDetailPage,
})

function BundleDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const prefix = `/${tenant}/${locale}`

  const { data: bundle, isLoading, error } = useQuery({
    queryKey: ["bundle", id],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ bundle: any }>(
        `/store/bundles/${id}`,
        { method: "GET", credentials: "include" }
      )
      return normalizeItem(response.bundle || response)
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

  if (error || !bundle) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-ds-foreground mb-2">Bundle Not Found</h2>
            <p className="text-ds-muted-foreground mb-6">This bundle may have been removed or is no longer available.</p>
            <Link to={`${prefix}/bundles` as any} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:bg-ds-primary/90 transition-colors">
              Browse Bundles
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const items = bundle.items || bundle.products || bundle.included_items || []
  const totalValue = bundle.total_value || bundle.original_price || items.reduce((sum: number, i: any) => sum + (Number(i.price) || 0), 0)
  const bundlePrice = bundle.price || bundle.bundle_price
  const savingsAmount = totalValue && bundlePrice ? Number(totalValue) - Number(bundlePrice) : 0
  const savingsPercent = totalValue && bundlePrice ? ((savingsAmount / Number(totalValue)) * 100).toFixed(0) : 0

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`${prefix}/bundles` as any} className="hover:text-ds-foreground transition-colors">Bundles</Link>
            <span>/</span>
            <span className="text-ds-foreground truncate">{bundle.title || bundle.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/9] bg-ds-muted rounded-xl overflow-hidden">
              {bundle.thumbnail || bundle.image ? (
                <img src={bundle.thumbnail || bundle.image} alt={bundle.title || bundle.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
                  <svg className="w-16 h-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              )}
              {savingsAmount > 0 && (
                <span className="absolute top-4 start-4 px-3 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">
                  Save ${savingsAmount.toLocaleString()}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ds-foreground">{bundle.title || bundle.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {bundlePrice != null && (
                  <span className="text-2xl font-bold text-ds-primary">${Number(bundlePrice).toLocaleString()}</span>
                )}
                {totalValue > 0 && bundlePrice && Number(totalValue) > Number(bundlePrice) && (
                  <span className="text-lg text-ds-muted-foreground line-through">${Number(totalValue).toLocaleString()}</span>
                )}
                {Number(savingsPercent) > 0 && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">{savingsPercent}% off</span>
                )}
              </div>
            </div>

            {bundle.description && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Bundle Description</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{bundle.description}</p>
              </div>
            )}

            {items.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-4">Included Items ({items.length})</h2>
                <div className="space-y-3">
                  {items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-ds-muted/30 rounded-lg">
                      {(item.thumbnail || item.image) ? (
                        <img src={item.thumbnail || item.image} alt={item.title || item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 bg-ds-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-ds-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-ds-foreground text-sm truncate">{item.title || item.name}</h3>
                        {item.description && <p className="text-xs text-ds-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>}
                        {item.quantity && item.quantity > 1 && <p className="text-xs text-ds-muted-foreground mt-0.5">Qty: {item.quantity}</p>}
                      </div>
                      {item.price != null && (
                        <span className="text-sm font-medium text-ds-foreground flex-shrink-0">${Number(item.price).toLocaleString()}</span>
                      )}
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
                  <p className="text-sm text-ds-muted-foreground">Bundle Price</p>
                  <p className="text-3xl font-bold text-ds-foreground">
                    {bundlePrice != null ? `$${Number(bundlePrice).toLocaleString()}` : "Contact for price"}
                  </p>
                  {totalValue > 0 && bundlePrice && Number(totalValue) > Number(bundlePrice) && (
                    <div className="mt-2">
                      <p className="text-sm text-ds-muted-foreground">Total value: <span className="line-through">${Number(totalValue).toLocaleString()}</span></p>
                      <p className="text-sm font-medium text-ds-success">You save ${savingsAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <button className="w-full py-3 px-4 bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                  Add Bundle to Cart
                </button>

                <button className="w-full py-3 px-4 border border-ds-border text-ds-foreground rounded-lg font-medium hover:bg-ds-muted transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Save for Later
                </button>
              </div>

              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h3 className="font-semibold text-ds-foreground mb-3">Bundle Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ds-muted-foreground">Items Included</span>
                    <span className="text-ds-foreground font-medium">{items.length}</span>
                  </div>
                  {totalValue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-ds-muted-foreground">Total Value</span>
                      <span className="text-ds-foreground font-medium">${Number(totalValue).toLocaleString()}</span>
                    </div>
                  )}
                  {bundlePrice != null && (
                    <div className="flex justify-between">
                      <span className="text-ds-muted-foreground">Bundle Price</span>
                      <span className="text-ds-primary font-medium">${Number(bundlePrice).toLocaleString()}</span>
                    </div>
                  )}
                  {savingsAmount > 0 && (
                    <div className="flex justify-between border-t border-ds-border pt-2">
                      <span className="text-ds-success font-medium">Your Savings</span>
                      <span className="text-ds-success font-bold">${savingsAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
