import { createFileRoute, Link } from "@tanstack/react-router"
import { VendorProducts } from "@/components/vendors/vendor-products"
import { VendorHeader } from "@/components/vendors/vendor-header"
import { ArrowLeft } from "@medusajs/icons"

export const Route = createFileRoute("/$countryCode/vendors/$handle/products")({
  component: VendorProductsPage,
})

function VendorProductsPage() {
  const { countryCode, handle } = Route.useParams()

  // Mock data - would come from API
  const vendor = {
    id: "vendor_1",
    name: "Artisan Crafts Co.",
    handle,
    logo: undefined,
    banner: undefined,
    description: "Handcrafted goods made with love and care.",
    rating: 4.8,
    reviewCount: 156,
    productCount: 48,
    location: "Portland, OR",
    badges: ["verified", "top_seller"] as const,
  }

  const products = Array.from({ length: 24 }, (_, i) => ({
    id: `prod_${i + 1}`,
    title: `Handcrafted Product ${i + 1}`,
    handle: `product-${i + 1}`,
    thumbnail: undefined,
    price: 25 + Math.floor(Math.random() * 75),
    currency_code: "usd",
    collection: i % 3 === 0 ? "New Arrivals" : i % 3 === 1 ? "Best Sellers" : "Classics",
  }))

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          to={`/${countryCode}/vendors/${handle}`}
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
                  {vendor.name[0]}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">{vendor.name}</h1>
              <p className="text-zinc-500">{products.length} products</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <VendorProducts
          products={products}
          countryCode={countryCode}
          vendorHandle={handle}
        />
      </div>
    </div>
  )
}
