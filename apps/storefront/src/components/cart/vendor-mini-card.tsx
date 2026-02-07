import { Link } from "@tanstack/react-router"
import { Star, ChevronRight } from "@medusajs/icons"

interface VendorMiniCardProps {
  vendorId: string
  vendorName: string
  vendorHandle: string
  vendorLogo?: string
  rating?: number
  countryCode: string
}

export function VendorMiniCard({
  vendorId,
  vendorName,
  vendorHandle,
  vendorLogo,
  rating,
  countryCode,
}: VendorMiniCardProps) {
  return (
    <Link
      to={`/${countryCode}/vendors/${vendorHandle}` as any}
      className="inline-flex items-center gap-3 px-3 py-2 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden flex-shrink-0">
        {vendorLogo ? (
          <img
            src={vendorLogo}
            alt={vendorName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs font-semibold">
            {vendorName[0]}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">{vendorName}</p>
        {rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-zinc-500">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
    </Link>
  )
}
