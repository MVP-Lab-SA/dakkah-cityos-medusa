import { Link } from "@tanstack/react-router"
import { useTenantPrefix } from "@/lib/context/tenant-context"

interface Vendor {
  id: string
  name: string
  handle: string
  logo?: string
  description?: string
  product_count?: number
}

interface VendorsSectionProps {
  vendors: Vendor[]
  config: Record<string, any>
}

export function VendorsSection({ vendors, config }: VendorsSectionProps) {
  const prefix = useTenantPrefix()
  if (vendors.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {config.title || "Featured Vendors"}
            </h2>
            <p className="mt-2 text-gray-600">
              {config.subtitle || "Shop from our trusted marketplace sellers"}
            </p>
          </div>
          <Link
            to={`${prefix}/vendors` as any}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            View All Vendors
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map(vendor => (
            <Link
              key={vendor.id}
              to={`${prefix}/vendors/${vendor.handle}` as any}
              className="group border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {vendor.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-600">
                    {vendor.name}
                  </h3>
                  {vendor.product_count !== undefined && (
                    <p className="text-sm text-gray-500">
                      {vendor.product_count} products
                    </p>
                  )}
                </div>
              </div>
              {vendor.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {vendor.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
