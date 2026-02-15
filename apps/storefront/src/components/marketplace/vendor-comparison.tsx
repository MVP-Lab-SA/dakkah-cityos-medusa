import { useState } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface VendorComparisonData {
  id: string
  name: string
  logo?: string
  rating: number
  reviewCount: number
  pricing: "budget" | "mid" | "premium"
  shippingDays: number
  freeReturns: boolean
  returnDays: number
  verified: boolean
}

interface VendorComparisonProps {
  locale?: string
  vendors: VendorComparisonData[]
  onRemoveVendor?: (vendorId: string) => void
}

const pricingLabels: Record<string, string> = {
  budget: "$",
  mid: "$$",
  premium: "$$$",
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= Math.round(rating) ? "text-ds-warning" : "text-ds-muted"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-medium text-ds-foreground ms-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export function VendorComparison({ locale: localeProp, vendors, onRemoveVendor }: VendorComparisonProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (vendors.length === 0) return null

  const comparisonRows = [
    { key: "rating", label: t(locale, "marketplace.rating") },
    { key: "pricing", label: t(locale, "marketplace.pricing") },
    { key: "shipping_speed", label: t(locale, "marketplace.shipping_speed") },
    { key: "return_policy", label: t(locale, "marketplace.return_policy") },
  ]

  return (
    <div className="bg-ds-card rounded-lg border border-ds-border overflow-hidden">
      <div className="p-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">
          {t(locale, "marketplace.vendor_comparison")}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ds-border">
              <th className="p-4 text-start text-sm font-medium text-ds-muted-foreground w-40">
                {t(locale, "marketplace.compare")}
              </th>
              {vendors.map((vendor) => (
                <th key={vendor.id} className="p-4 text-center min-w-[180px]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-ds-muted overflow-hidden">
                      {vendor.logo ? (
                        <img loading="lazy" src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-ds-muted-foreground">
                          {vendor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-ds-foreground text-sm">{vendor.name}</span>
                      {vendor.verified && (
                        <svg className="h-4 w-4 text-ds-info" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {onRemoveVendor && (
                      <button
                        onClick={() => onRemoveVendor(vendor.id)}
                        className="text-xs text-ds-destructive hover:underline"
                      >
                        {t(locale, "marketplace.remove_from_compare")}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, idx) => (
              <tr key={row.key} className={idx < comparisonRows.length - 1 ? "border-b border-ds-border" : ""}>
                <td className="p-4 text-sm font-medium text-ds-muted-foreground">{row.label}</td>
                {vendors.map((vendor) => (
                  <td key={vendor.id} className="p-4 text-center">
                    {row.key === "rating" && <StarRating rating={vendor.rating} />}
                    {row.key === "pricing" && (
                      <span className="text-sm font-semibold text-ds-foreground">
                        {pricingLabels[vendor.pricing] || vendor.pricing}
                      </span>
                    )}
                    {row.key === "shipping_speed" && (
                      <span className="text-sm text-ds-foreground">
                        {t(locale, "marketplace.ships_in")} {vendor.shippingDays} {t(locale, "marketplace.days")}
                      </span>
                    )}
                    {row.key === "return_policy" && (
                      <div className="flex flex-col items-center gap-1">
                        {vendor.freeReturns && (
                          <span className="text-xs bg-ds-success/10 text-ds-success px-2 py-0.5 rounded-full">
                            {t(locale, "marketplace.free_returns")}
                          </span>
                        )}
                        <span className="text-sm text-ds-muted-foreground">
                          {vendor.returnDays} {t(locale, "marketplace.days")}
                        </span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
