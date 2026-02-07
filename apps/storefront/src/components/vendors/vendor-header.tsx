import { Star, CheckCircleSolid, MapPin, Calendar } from "@medusajs/icons"
import type { Vendor } from "@/lib/hooks/use-vendors"

interface VendorHeaderProps {
  vendor: Vendor
}

export function VendorHeader({ vendor }: VendorHeaderProps) {
  return (
    <div className="bg-white border-b border-zinc-200">
      {/* Banner */}
      <div className="h-48 md:h-64 bg-zinc-100 relative">
        {vendor.banner && (
          <img
            src={vendor.banner}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Info */}
      <div className="content-container relative">
        {/* Logo */}
        <div className="absolute -top-12 left-0">
          <div className="w-24 h-24 rounded-lg bg-white border-4 border-white shadow-lg overflow-hidden">
            {vendor.logo ? (
              <img
                src={vendor.logo}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-3xl font-bold text-zinc-400">
                {vendor.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="pt-16 pb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">{vendor.name}</h1>
                {vendor.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    <CheckCircleSolid className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>

              {vendor.description && (
                <p className="text-zinc-600 mt-2 max-w-2xl">{vendor.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4">
                {vendor.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-zinc-900">{vendor.rating.toFixed(1)}</span>
                    {vendor.review_count !== undefined && (
                      <span className="text-zinc-500">({vendor.review_count} reviews)</span>
                    )}
                  </div>
                )}
                {vendor.location && (
                  <div className="flex items-center gap-1 text-zinc-500">
                    <MapPin className="h-4 w-4" />
                    {vendor.location}
                  </div>
                )}
                {vendor.established_year && (
                  <div className="flex items-center gap-1 text-zinc-500">
                    <Calendar className="h-4 w-4" />
                    Est. {vendor.established_year}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {vendor.product_count !== undefined && (
                <div className="text-center px-4 py-2 bg-zinc-50 rounded-lg">
                  <p className="text-2xl font-bold text-zinc-900">{vendor.product_count}</p>
                  <p className="text-xs text-zinc-500">Products</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
