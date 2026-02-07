import { createFileRoute, Link } from "@tanstack/react-router"
import { useVendor, useVendorProducts } from "@/lib/hooks/use-vendors"
import { VendorHeader } from "@/components/vendors"
import { ArrowLeft, Spinner, ShoppingBag } from "@medusajs/icons"

export const Route = createFileRoute("/$countryCode/vendors/$handle")({
  component: VendorPage,
})

function VendorPage() {
  const { countryCode, handle } = Route.useParams() as { countryCode: string; handle: string }
  const { data: vendor, isLoading: vendorLoading } = useVendor(handle)
  const { data: productsData, isLoading: productsLoading } = useVendorProducts(handle)
  const baseHref = `/${countryCode}`

  if (vendorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Vendor not found</p>
          <Link
            to={`${baseHref}/vendors` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to vendors
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <VendorHeader vendor={vendor} />

      {/* Products Section */}
      <div className="content-container py-8">
        {/* Back Link */}
        <Link
          to={`${baseHref}/vendors` as any}
          className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          All vendors
        </Link>

        <h2 className="text-xl font-bold text-zinc-900 mb-6">Products by {vendor.name}</h2>

        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !productsData?.products?.length ? (
          <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
            <ShoppingBag className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsData.products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                <div className="aspect-square bg-zinc-100">
                  {product.thumbnail && (
                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-zinc-900">{product.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
