import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { useVendor, useVendorProducts } from "@/lib/hooks/use-vendors"
import { VendorHeader } from "@/components/vendors/vendor-header"
import ProductCard from "@/components/product-card"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/vendors/$handle")({
  component: VendorStorefrontPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title || loaderData?.name || loaderData?.handle || "Vendor Details"} | Dakkah CityOS` },
      { name: "description", content: loaderData?.description || loaderData?.excerpt || "" },
    ],
  }),
})

function VendorStorefrontPage() {
  const { tenant, locale, handle } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const { data: vendor, isLoading: vendorLoading, error: vendorError } = useVendor(handle)
  const { data: productsData, isLoading: productsLoading } = useVendorProducts(vendor?.id || handle, { limit: 24 })
  const [view, setView] = useState<"grid" | "list">("grid")

  if (vendorLoading) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="h-64 bg-ds-muted animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-ds-muted rounded animate-pulse w-1/3 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[29/34] bg-ds-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (vendorError || !vendor) {
    return (
      <div className="min-h-screen bg-ds-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-ds-destructive mb-4">Vendor not found</p>
          <Link to={`${prefix}/vendors` as any} className="text-ds-primary hover:underline">
            Back to Vendors
          </Link>
        </div>
      </div>
    )
  }

  const products = productsData?.products || []

  return (
    <div className="min-h-screen bg-ds-background">
      <VendorHeader vendor={vendor} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-ds-foreground">
            Products {productsData?.count !== undefined && (
              <span className="text-ds-muted-foreground font-normal text-base">({productsData.count})</span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-ds-primary text-ds-primary-foreground" : "bg-ds-muted text-ds-muted-foreground"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-ds-primary text-ds-primary-foreground" : "bg-ds-muted text-ds-muted-foreground"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[29/34] bg-ds-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !products.length ? (
          <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
            <svg className="w-12 h-12 text-ds-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-ds-muted-foreground">This vendor has no products yet</p>
          </div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
