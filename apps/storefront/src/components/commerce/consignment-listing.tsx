import { t, formatCurrency, formatDate, type SupportedLocale } from "@/lib/i18n"

interface ConsignmentListingProps {
  id: string
  title: string
  thumbnail?: string
  askingPrice: number
  currencyCode?: string
  commissionRate: number
  status: "pending" | "listed" | "sold" | "returned"
  listedAt?: string
  locale: string
}

const statusColors: Record<string, string> = {
  pending: "bg-ds-muted text-ds-muted-foreground",
  listed: "bg-ds-primary/10 text-ds-primary",
  sold: "bg-ds-success/10 text-ds-success",
  returned: "bg-ds-destructive/10 text-ds-destructive",
}

export function ConsignmentListing({
  title,
  thumbnail,
  askingPrice,
  currencyCode = "USD",
  commissionRate,
  status,
  listedAt,
  locale,
}: ConsignmentListingProps) {
  return (
    <div className="bg-ds-background rounded-lg border border-ds-border p-4 sm:p-6">
      <div className="flex items-start gap-4">
        {thumbnail ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-ds-muted flex-shrink-0">
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-ds-muted flex-shrink-0 flex items-center justify-center">
            <span className="text-ds-muted-foreground text-xs">
              {t(locale, "commerce.no_image")}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-ds-foreground truncate">{title}</h3>
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${statusColors[status] || statusColors.pending}`}>
              {t(locale, `commerce.status_${status}`)}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <div>
              <p className="text-xs text-ds-muted-foreground">
                {t(locale, "commerce.asking_price")}
              </p>
              <p className="text-sm font-semibold text-ds-foreground">
                {formatCurrency(askingPrice, currencyCode, locale as SupportedLocale)}
              </p>
            </div>
            <div>
              <p className="text-xs text-ds-muted-foreground">
                {t(locale, "commerce.commission")}
              </p>
              <p className="text-sm font-semibold text-ds-foreground">
                {commissionRate}%
              </p>
            </div>
            {listedAt && (
              <div>
                <p className="text-xs text-ds-muted-foreground">
                  {t(locale, "commerce.listed_date")}
                </p>
                <p className="text-sm text-ds-foreground">
                  {formatDate(listedAt, locale as SupportedLocale)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
