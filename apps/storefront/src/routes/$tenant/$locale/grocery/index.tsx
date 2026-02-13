// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/grocery/")({
  component: GroceryPage,
})

const categories = ["all", "fruits", "vegetables", "dairy", "meat", "bakery", "beverages", "snacks", "frozen", "pantry"] as const
const dietaryOptions = ["all", "organic", "gluten-free", "vegan", "keto", "sugar-free"] as const
const priceRanges = ["all", "under-5", "5-10", "10-20", "over-20"] as const

function GroceryPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [dietary, setDietary] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const { data, isLoading, error } = useQuery({
    queryKey: ["grocery", category, dietary, priceRange, page],
    queryFn: () =>
      sdk.client.fetch<{ products: any[]; count: number }>(`/store/grocery`, {
        query: {
          ...(category !== "all" && { category }),
          ...(dietary !== "all" && { dietary }),
          ...(priceRange !== "all" && { price_range: priceRange }),
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
            <span className="text-ds-foreground">Grocery</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Grocery Products</h1>
          <p className="mt-2 text-ds-muted-foreground">Fresh groceries delivered to your doorstep</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search groceries..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Category</label>
                <div className="space-y-1">
                  {categories.map((opt) => (
                    <button key={opt} onClick={() => { setCategory(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${category === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Dietary</label>
                <div className="space-y-1">
                  {dietaryOptions.map((opt) => (
                    <button key={opt} onClick={() => { setDietary(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${dietary === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Price Range</label>
                <div className="space-y-1">
                  {priceRanges.map((opt) => (
                    <button key={opt} onClick={() => { setPriceRange(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${priceRange === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Prices" : opt === "under-5" ? "Under $5" : opt === "5-10" ? "$5 - $10" : opt === "10-20" ? "$10 - $20" : "Over $20"}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading grocery products.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                    <div className="aspect-square bg-ds-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                      <div className="h-8 w-full bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !filtered || filtered.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No grocery products found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((product: any) => (
                    <a key={product.id} href={`${prefix}/grocery/${product.id}`} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200">
                      <div className="aspect-square bg-ds-muted relative overflow-hidden">
                        {product.thumbnail && <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                          {product.is_organic && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500 text-white">Organic</span>}
                          {product.is_gluten_free && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-500 text-white">Gluten Free</span>}
                        </div>
                        {product.freshness && (
                          <span className="absolute bottom-3 right-3 px-2 py-0.5 text-xs font-medium rounded-full bg-black/60 text-white capitalize">{product.freshness}</span>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{product.name || "Grocery Item"}</h3>
                        <div className="flex items-center gap-2 text-xs text-ds-muted-foreground">
                          {product.category && <span className="capitalize">{product.category}</span>}
                          {product.weight && <span>{product.weight}</span>}
                          {product.unit && !product.weight && <span>per {product.unit}</span>}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <span className="text-lg font-bold text-ds-foreground">{product.price ? `$${(product.price / 100).toFixed(2)}` : "Price TBD"}</span>
                            {product.unit && <span className="text-xs text-ds-muted-foreground ml-1">/{product.unit}</span>}
                          </div>
                          <span className="text-sm font-medium text-ds-primary group-hover:underline">Add to Cart →</span>
                        </div>
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
