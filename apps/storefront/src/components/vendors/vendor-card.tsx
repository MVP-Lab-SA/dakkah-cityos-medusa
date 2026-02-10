import { Link } from "@tanstack/react-router"
import { useTenantPrefix } from "@/lib/context/tenant-context"
import { Star, CheckCircleSolid, MapPin } from "@medusajs/icons"
import type { Vendor } from "@/lib/hooks/use-vendors"

interface VendorCardProps {
  vendor: Vendor
}

export function VendorCard({ vendor }: VendorCardProps) {
  const prefix = useTenantPrefix()

  return (
    <Link
      to={`${prefix}/vendors/${vendor.handle}` as any}
      className="group bg-white rounded-lg border border-zinc-200 overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all"
    >
      {/* Banner */}
      <div className="h-24 bg-zinc-100 relative">
        {vendor.banner && (
          <img
            src={vendor.banner}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
        )}
        {/* Logo */}
        <div className="absolute -bottom-8 left-4">
          <div className="w-16 h-16 rounded-lg bg-white border-2 border-white shadow-md overflow-hidden">
            {vendor.logo ? (
              <img
                src={vendor.logo}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-xl font-bold text-zinc-400">
                {vendor.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 pb-4 px-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
            {vendor.name}
          </h3>
          {vendor.verified && (
            <CheckCircleSolid className="h-4 w-4 text-blue-500" />
          )}
        </div>

        {vendor.location && (
          <div className="flex items-center gap-1 mt-1 text-sm text-zinc-500">
            <MapPin className="h-3 w-3" />
            {vendor.location}
          </div>
        )}

        {vendor.description && (
          <p className="text-sm text-zinc-600 mt-2 line-clamp-2">{vendor.description}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
          {vendor.rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-zinc-900">{vendor.rating.toFixed(1)}</span>
              {vendor.review_count !== undefined && (
                <span className="text-sm text-zinc-500">({vendor.review_count})</span>
              )}
            </div>
          )}
          {vendor.product_count !== undefined && (
            <span className="text-sm text-zinc-500">{vendor.product_count} products</span>
          )}
        </div>
      </div>
    </Link>
  )
}
