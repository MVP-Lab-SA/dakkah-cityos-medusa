import { createFileRoute, Link } from "@tanstack/react-router"
import { VendorProducts } from "@/components/vendors/vendor-products"
import { ArrowLeft, Spinner } from "@medusajs/icons"
import { useVendor, useVendorProducts } from "@/lib/hooks/use-vendors"

export const Route = createFileRoute("/$tenant/$locale/vendors/$handle/products")({
  component: VendorProductsPage,
})

function VendorProductsPage() {
  const { tenant, locale, handle } = Route.useParams()

  // Fetch real vendor data
  const { data: vendorData, isLoading: vendorLoading } = useVendor(handle)
  const vendor = (vendorData as any)?.vendor || vendorData
  const { data: productsData, isLoading: productsLoading } = useVendorProducts(vendor?.id || "", {
    limit: 100,
  })

  const isLoading = vendorLoading || productsLoading
  const products = (productsData as any)?.products || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Spinner className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Vendor not found</h1>
          <Link to={`/${tenant}/${locale}/vendors` as any} className="text-blue-600 hover:underline">
            Browse all vendors
          </Link>
        </div>
      </div>
    )
  }

  // Transform products for the VendorProducts component
  const transformedProducts = products.map((p: any) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.thumbnail,
    price: p.variants?.[0]?.prices?.[0]?.amount || 0,
    currency_code: p.variants?.[0]?.prices?.[0]?.currency_code || "usd",
    collection: p.collection?.title || null,
  }))

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          to={`/${tenant}/${locale}/vendors/${handle}` as any}
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {vendor.name}
        </Link>

        {/* Mini Header */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 overflow-hidden">
              {vendor.logo ? (
                <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-400">
                  {vendor.name?.[0] || "V"}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">{vendor.name}</h1>
              <p className="text-zinc-500">{transformedProducts.length} products</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <VendorProducts
          products={transformedProducts}
          countryCode={locale}
          vendorHandle={handle}
        />
      </div>
    </div>
  )
}
