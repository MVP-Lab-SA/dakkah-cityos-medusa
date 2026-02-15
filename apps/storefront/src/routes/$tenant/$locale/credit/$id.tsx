// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { normalizeItem } from "@/lib/utils/normalize-item"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/credit/$id")({
  component: CreditDetailPage,
})

function CreditDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null)

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["financial-product", id],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ item: any }>(
        `/store/financial-products/${id}`,
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-ds-foreground mb-2">Product Not Found</h2>
            <p className="text-ds-muted-foreground mb-6">This financing option may have been removed or is no longer available.</p>
            <Link to={`${prefix}/credit` as any} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:bg-ds-primary/90 transition-colors">
              Browse Financing Options
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const apr = product.apr || product.interest_rate
  const terms = product.term_options || product.terms || []
  const price = product.price || product.amount || product.principal

  const calculateMonthly = (principal: number, rate: number, months: number) => {
    if (!principal || !months) return null
    if (!rate || rate === 0) return (principal / months).toFixed(2)
    const monthlyRate = rate / 100 / 12
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return payment.toFixed(2)
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`${prefix}/credit` as any} className="hover:text-ds-foreground transition-colors">Credit & Financing</Link>
            <span>/</span>
            <span className="text-ds-foreground truncate">{product.title || product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/9] bg-ds-muted rounded-xl overflow-hidden">
              {product.thumbnail || product.image ? (
                <img src={product.thumbnail || product.image} alt={product.title || product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                  <svg className="w-16 h-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {product.type && (
                <span className="absolute top-4 start-4 px-3 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
                  {product.type}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ds-foreground">{product.title || product.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {apr != null && (
                  <span className="text-2xl font-bold text-ds-primary">{apr}% APR</span>
                )}
                {product.category && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-ds-muted text-ds-muted-foreground">{product.category}</span>
                )}
              </div>
            </div>

            {product.description && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Overview</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {terms.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-4">Term Options</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {terms.map((term: any, idx: number) => {
                    const months = typeof term === "object" ? term.months || term.duration : term
                    const termApr = typeof term === "object" ? term.apr || apr : apr
                    const monthly = price && months ? calculateMonthly(Number(price), Number(termApr || 0), Number(months)) : null
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedTerm(Number(months))}
                        className={`p-4 rounded-lg border text-center transition-colors ${selectedTerm === Number(months) ? "border-ds-primary bg-ds-primary/5" : "border-ds-border hover:bg-ds-muted"}`}
                      >
                        <p className="font-bold text-ds-foreground">{months} months</p>
                        {monthly && <p className="text-sm text-ds-primary font-medium mt-1">${monthly}/mo</p>}
                        {typeof term === "object" && term.apr && (
                          <p className="text-xs text-ds-muted-foreground mt-0.5">{term.apr}% APR</p>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {product.requirements && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Requirements</h2>
                {Array.isArray(product.requirements) ? (
                  <ul className="space-y-2">
                    {product.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-ds-muted-foreground">
                        <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {req}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{product.requirements}</p>
                )}
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-ds-muted-foreground">
                      <svg className="w-4 h-4 text-ds-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {feature}
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
                  {apr != null && (
                    <>
                      <p className="text-sm text-ds-muted-foreground">Annual Percentage Rate</p>
                      <p className="text-3xl font-bold text-ds-foreground">{apr}%</p>
                    </>
                  )}
                  {price != null && selectedTerm && (
                    <div className="mt-3 pt-3 border-t border-ds-border">
                      <p className="text-sm text-ds-muted-foreground">Est. Monthly Payment</p>
                      <p className="text-2xl font-bold text-ds-primary">
                        ${calculateMonthly(Number(price), Number(apr || 0), selectedTerm)}/mo
                      </p>
                      <p className="text-xs text-ds-muted-foreground mt-1">for {selectedTerm} months</p>
                    </div>
                  )}
                </div>

                <button className="w-full py-3 px-4 bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Apply Now
                </button>

                <button className="w-full py-3 px-4 border border-ds-border text-ds-foreground rounded-lg font-medium hover:bg-ds-muted transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Check Eligibility
                </button>
              </div>

              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h3 className="font-semibold text-ds-foreground mb-3">Key Details</h3>
                <div className="space-y-2 text-sm">
                  {apr != null && (
                    <div className="flex justify-between">
                      <span className="text-ds-muted-foreground">APR</span>
                      <span className="text-ds-foreground font-medium">{apr}%</span>
                    </div>
                  )}
                  {price != null && (
                    <div className="flex justify-between">
                      <span className="text-ds-muted-foreground">Amount</span>
                      <span className="text-ds-foreground font-medium">${Number(price).toLocaleString()}</span>
                    </div>
                  )}
                  {product.min_amount && (
                    <div className="flex justify-between">
                      <span className="text-ds-muted-foreground">Min Amount</span>
                      <span className="text-ds-foreground font-medium">${Number(product.min_amount).toLocaleString()}</span>
                    </div>
                  )}
                  {product.max_amount && (
                    <div className="flex justify-between">
                      <span className="text-ds-muted-foreground">Max Amount</span>
                      <span className="text-ds-foreground font-medium">${Number(product.max_amount).toLocaleString()}</span>
                    </div>
                  )}
                  {product.processing_time && (
                    <div className="flex justify-between">
                      <span className="text-ds-muted-foreground">Processing</span>
                      <span className="text-ds-foreground font-medium">{product.processing_time}</span>
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
