// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/financial/")({
  component: FinancialPage,
})

const productTypes = ["all", "loan", "savings", "investment", "credit-card", "mortgage", "insurance"] as const
const rateRanges = ["all", "under-3", "3-5", "5-10", "over-10"] as const

function FinancialPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [productType, setProductType] = useState("all")
  const [rateRange, setRateRange] = useState("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const { data, isLoading, error } = useQuery({
    queryKey: ["financial", productType, rateRange, page],
    queryFn: () =>
      sdk.client.fetch<{ products: any[]; count: number }>(`/store/financial-products`, {
        query: {
          ...(productType !== "all" && { type: productType }),
          ...(rateRange !== "all" && { rate_range: rateRange }),
          limit,
          offset: (page - 1) * limit,
        },
      }),
  })

  const products = data?.products || []
  const totalPages = Math.ceil((data?.count || 0) / limit)
  const filtered = products.filter((p: any) =>
    searchQuery ? (p.name || p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Financial Products</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Financial Products</h1>
          <p className="mt-2 text-ds-muted-foreground">Compare loans, savings accounts, investments, and more</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Product Type</label>
                <div className="space-y-1">
                  {productTypes.map((opt) => (
                    <button key={opt} onClick={() => { setProductType(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${productType === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Types" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Interest Rate</label>
                <div className="space-y-1">
                  {rateRanges.map((opt) => (
                    <button key={opt} onClick={() => { setRateRange(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${rateRange === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Rates" : opt === "under-3" ? "Under 3%" : opt === "3-5" ? "3% - 5%" : opt === "5-10" ? "5% - 10%" : "Over 10%"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {error ? (
              <div className="bg-ds-destructive/10 border border-ds-destructive/20 rounded-xl p-8 text-center">
                <svg className="w-12 h-12 text-ds-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-ds-destructive font-medium">Something went wrong loading financial products.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-3">
                    <div className="h-10 w-10 bg-ds-muted rounded-lg animate-pulse" />
                    <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                    <div className="h-12 w-full bg-ds-muted rounded animate-pulse" />
                    <div className="h-8 w-full bg-ds-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : !filtered || filtered.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No financial products found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((product: any) => (
                    <a key={product.id} href={`${prefix}/financial/${product.id}`} className="group bg-ds-background border border-ds-border rounded-xl p-6 hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-ds-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{product.name || "Financial Product"}</h3>
                          {product.provider && <p className="text-xs text-ds-muted-foreground">{product.provider}</p>}
                        </div>
                      </div>
                      {product.type && <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-ds-muted text-ds-muted-foreground mb-3">{product.type}</span>}
                      <div className="space-y-2 text-sm mb-4">
                        {product.rate != null && (
                          <div className="flex justify-between">
                            <span className="text-ds-muted-foreground">Rate</span>
                            <span className="font-bold text-xl text-ds-primary">{product.rate}%</span>
                          </div>
                        )}
                        {product.term && (
                          <div className="flex justify-between">
                            <span className="text-ds-muted-foreground">Term</span>
                            <span className="font-medium text-ds-foreground">{product.term}</span>
                          </div>
                        )}
                        {product.min_amount && (
                          <div className="flex justify-between">
                            <span className="text-ds-muted-foreground">Min. Amount</span>
                            <span className="font-medium text-ds-foreground">${(product.min_amount / 100).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-3 border-t border-ds-border">
                        <span className="text-sm font-medium text-ds-primary group-hover:underline">Learn More →</span>
                      </div>
                    </a>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                    <span className="px-4 py-2 text-sm text-ds-muted-foreground">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
