// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/consignment-shop/$id")({
  component: ConsignmentDetailPage,
})

function ConsignmentDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [saved, setSaved] = useState(false)

  const { data: item, isLoading, error } = useQuery({
    queryKey: ["consignment", id],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ item: any }>(
        `/store/consignments/${id}`,
        { method: "GET", credentials: "include" }
      )
      return response.item || response
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
            <h2 className="text-xl font-semibold text-ds-foreground mb-2">Consignment Item Not Found</h2>
            <p className="text-ds-muted-foreground mb-6">This consignment item may have been sold or is no longer available.</p>
            <Link to={`${prefix}/consignment-shop` as any} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:bg-ds-primary/90 transition-colors">
              Browse Consignment Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const originalPrice = item.original_price || item.originalPrice || item.retail_price
  const savings = originalPrice && item.price ? Math.round((1 - item.price / originalPrice) * 100) : null

  const specs = [
    { label: "Condition", value: item.condition },
    { label: "Brand", value: item.brand },
    { label: "Category", value: item.category },
    { label: "Size", value: item.size },
    { label: "Color", value: item.color },
    { label: "Material", value: item.material },
    { label: "Authenticity", value: item.authenticity || item.authenticated ? "Verified" : null },
  ].filter((s) => s.value)

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`${prefix}/consignment-shop` as any} className="hover:text-ds-foreground transition-colors">Consignment Shop</Link>
            <span>/</span>
            <span className="text-ds-foreground truncate">{item.name || item.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/9] bg-ds-muted rounded-xl overflow-hidden">
              {item.thumbnail || item.image ? (
                <img src={item.thumbnail || item.image} alt={item.name || item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-ds-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {item.condition && (
                <span className="absolute top-4 start-4 px-3 py-1 text-xs font-semibold rounded-full bg-ds-primary text-ds-primary-foreground">
                  {item.condition}
                </span>
              )}
              {savings && (
                <span className="absolute top-4 end-4 px-3 py-1 text-xs font-semibold rounded-full bg-ds-success/20 text-ds-success">
                  Save {savings}%
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ds-foreground">{item.name || item.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="text-2xl font-bold text-ds-primary">
                  {item.price != null ? `$${Number(item.price).toLocaleString()}` : "Contact for price"}
                </span>
                {originalPrice != null && (
                  <span className="text-lg text-ds-muted-foreground line-through">
                    ${Number(originalPrice).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {specs.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-4">Item Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="bg-ds-muted/30 rounded-lg p-3">
                      <p className="text-xs text-ds-muted-foreground">{spec.label}</p>
                      <p className="font-medium text-ds-foreground mt-0.5">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.description && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Description</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{item.description}</p>
              </div>
            )}

            {(item.provenance || item.history) && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Provenance & History</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{item.provenance || item.history}</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="sticky top-4 space-y-6">
              <div className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-ds-foreground">
                    {item.price != null ? `$${Number(item.price).toLocaleString()}` : "Contact for price"}
                  </p>
                  {originalPrice != null && (
                    <p className="text-sm text-ds-muted-foreground line-through mt-1">Retail: ${Number(originalPrice).toLocaleString()}</p>
                  )}
                </div>

                <button className="w-full py-3 px-4 bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                  Add to Cart
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm border transition-colors flex items-center justify-center gap-2 ${saved ? "bg-ds-primary/10 border-ds-primary text-ds-primary" : "border-ds-border text-ds-foreground hover:bg-ds-muted"}`}
                  >
                    <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {saved ? "Saved" : "Save"}
                  </button>
                  <button className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm border border-ds-border text-ds-foreground hover:bg-ds-muted transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    Share
                  </button>
                </div>
              </div>

              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h3 className="font-semibold text-ds-foreground mb-3">Buyer Guarantee</h3>
                <ul className="space-y-2 text-sm text-ds-muted-foreground">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Authenticity verified
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Condition as described
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Secure payment processing
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
