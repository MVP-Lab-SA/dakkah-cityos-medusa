import { t } from "@/lib/i18n"
import type { Supplier } from "@/lib/hooks/use-dropshipping"

export function SupplierCard({
  supplier,
  locale,
  onViewCatalog,
}: {
  supplier: Supplier
  locale: string
  onViewCatalog?: (id: string) => void
}) {
  return (
    <div className="bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:border-ds-ring transition-colors">
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          {supplier.logo ? (
            <img
              src={supplier.logo}
              alt={supplier.name}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-ds-muted flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-ds-muted-foreground">
                {supplier.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-ds-foreground truncate">
                {supplier.name}
              </h3>
              {supplier.verified && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-ds-success/10 text-ds-success rounded-full">
                  {t(locale, "dropshipping.verified")}
                </span>
              )}
            </div>
            {supplier.description && (
              <p className="text-sm text-ds-muted-foreground line-clamp-2 mt-1">
                {supplier.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-ds-muted-foreground">
          {supplier.productCount != null && (
            <span>
              {supplier.productCount} {t(locale, "dropshipping.products")}
            </span>
          )}
          {supplier.leadTime && (
            <span>
              {t(locale, "dropshipping.lead_time")}: {supplier.leadTime}
            </span>
          )}
        </div>

        {supplier.rating && (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-medium text-ds-foreground">
              {supplier.rating.average.toFixed(1)}
            </span>
            <svg className="w-4 h-4 text-ds-warning" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <span className="text-ds-muted-foreground">({supplier.rating.count})</span>
          </div>
        )}

        {supplier.shippingRegions && supplier.shippingRegions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {supplier.shippingRegions.slice(0, 3).map((region) => (
              <span
                key={region}
                className="px-2 py-0.5 text-xs bg-ds-muted text-ds-muted-foreground rounded-full"
              >
                {region}
              </span>
            ))}
            {supplier.shippingRegions.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-ds-muted text-ds-muted-foreground rounded-full">
                +{supplier.shippingRegions.length - 3}
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => onViewCatalog?.(supplier.id)}
          className="w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary/90 transition-colors"
        >
          {t(locale, "dropshipping.view_catalog")}
        </button>
      </div>
    </div>
  )
}
