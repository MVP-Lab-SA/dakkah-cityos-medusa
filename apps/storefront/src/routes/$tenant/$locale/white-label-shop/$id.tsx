// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/white-label-shop/$id")({
  component: WhiteLabelProductDetailPage,
})

function WhiteLabelProductDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["white-label-product", id],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ item: any }>(
        `/store/products/${id}`,
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
              <div className="h-48 bg-ds-muted rounded-xl animate-pulse" />
              <div className="h-32 bg-ds-muted rounded-xl animate-pulse" />
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
            <p className="text-ds-muted-foreground mb-6">This product may have been removed or is no longer available.</p>
            <Link to={`${prefix}/white-label-shop` as any} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:bg-ds-primary/90 transition-colors">
              Browse White Label Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const specs = [
    { label: "Brand", value: product.brand },
    { label: "SKU", value: product.sku },
    { label: "Category", value: product.category },
    { label: "MOQ", value: product.moq || product.minimum_order_quantity || product.min_order },
    { label: "Lead Time", value: product.lead_time || product.leadTime },
    { label: "Weight", value: product.weight ? `${product.weight} ${product.weight_unit || "g"}` : null },
    { label: "Origin", value: product.origin || product.country_of_origin },
  ].filter((s) => s.value)

  const pricingTiers = product.pricing_tiers || product.pricingTiers || product.bulk_pricing || []

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`${prefix}/white-label-shop` as any} className="hover:text-ds-foreground transition-colors">White Label Shop</Link>
            <span>/</span>
            <span className="text-ds-foreground truncate">{product.name || product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/9] bg-ds-muted rounded-xl overflow-hidden">
              {product.thumbnail || product.image ? (
                <img src={product.thumbnail || product.image} alt={product.name || product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-ds-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {product.brand && (
                <span className="absolute top-4 start-4 px-3 py-1 text-xs font-semibold rounded-full bg-ds-primary text-ds-primary-foreground">
                  {product.brand}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ds-foreground">{product.name || product.title}</h1>
              {product.brand && (
                <p className="text-sm text-ds-muted-foreground mt-1">by {product.brand}</p>
              )}
              <p className="text-2xl font-bold text-ds-primary mt-3">
                {product.price != null ? `$${Number(product.price).toLocaleString()}` : "Contact for price"}
              </p>
              {(product.moq || product.minimum_order_quantity || product.min_order) && (
                <p className="text-sm text-ds-muted-foreground mt-1">
                  Minimum order: {product.moq || product.minimum_order_quantity || product.min_order} units
                </p>
              )}
            </div>

            {specs.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-4">Product Specifications</h2>
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

            {product.description && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Description</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {pricingTiers.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-4">Volume Pricing</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ds-border">
                        <th className="text-left py-2 pr-4 text-ds-muted-foreground font-medium">Quantity</th>
                        <th className="text-left py-2 pr-4 text-ds-muted-foreground font-medium">Price per Unit</th>
                        <th className="text-left py-2 text-ds-muted-foreground font-medium">Savings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingTiers.map((tier: any, idx: number) => (
                        <tr key={idx} className="border-b border-ds-border/50">
                          <td className="py-2 pr-4 text-ds-foreground">{tier.min_quantity || tier.minQuantity || tier.quantity}+ units</td>
                          <td className="py-2 pr-4 text-ds-foreground font-medium">${Number(tier.price || tier.unit_price).toLocaleString()}</td>
                          <td className="py-2 text-ds-success">{tier.discount || tier.savings || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(product.customization || product.customization_options) && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Customization Options</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {typeof (product.customization || product.customization_options) === "string"
                    ? product.customization || product.customization_options
                    : JSON.stringify(product.customization || product.customization_options, null, 2)}
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="sticky top-4 space-y-6">
              <div className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-ds-foreground">
                    {product.price != null ? `$${Number(product.price).toLocaleString()}` : "Contact for price"}
                  </p>
                  <p className="text-xs text-ds-muted-foreground mt-1">per unit</p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-ds-muted-foreground">Qty:</label>
                  <div className="flex items-center border border-ds-border rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1.5 text-ds-foreground hover:bg-ds-muted transition-colors">-</button>
                    <span className="px-3 py-1.5 text-sm font-medium text-ds-foreground border-x border-ds-border">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1.5 text-ds-foreground hover:bg-ds-muted transition-colors">+</button>
                  </div>
                </div>

                <button className="w-full py-3 px-4 bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                  Request Quote
                </button>

                <button className="w-full py-3 px-4 border border-ds-border text-ds-foreground rounded-lg font-medium hover:bg-ds-muted transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Contact Sales
                </button>
              </div>

              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h3 className="font-semibold text-ds-foreground mb-3">White Label Benefits</h3>
                <ul className="space-y-2 text-sm text-ds-muted-foreground">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Custom branding available
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Private labeling
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Volume discounts
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Quality assurance included
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
