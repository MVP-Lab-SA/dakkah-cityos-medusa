import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface ReturnAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface ReturnLabelProps {
  trackingNumber: string
  carrier: string
  fromAddress: ReturnAddress
  toAddress: ReturnAddress
  barcode?: string
  onPrint?: () => void
  locale?: string
  className?: string
}

function AddressBlock({ label, address }: { label: string; address: ReturnAddress }) {
  return (
    <div>
      <p className="text-xs font-semibold text-ds-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-medium text-ds-foreground">{address.name}</p>
      <p className="text-xs text-ds-muted-foreground">{address.line1}</p>
      {address.line2 && <p className="text-xs text-ds-muted-foreground">{address.line2}</p>}
      <p className="text-xs text-ds-muted-foreground">
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p className="text-xs text-ds-muted-foreground">{address.country}</p>
    </div>
  )
}

export function ReturnLabel({
  trackingNumber,
  carrier,
  fromAddress,
  toAddress,
  barcode,
  onPrint,
  locale: localeProp,
  className,
}: ReturnLabelProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className={clsx("bg-ds-card border-2 border-dashed border-ds-border rounded-xl overflow-hidden", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-ds-foreground">
              {t(locale, "returns.return_label")}
            </h3>
            <p className="text-xs text-ds-muted-foreground mt-0.5">{carrier}</p>
          </div>
          <span className="text-3xl">📦</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AddressBlock label={t(locale, "returns.from")} address={fromAddress} />
          <AddressBlock label={t(locale, "returns.to")} address={toAddress} />
        </div>

        <div className="mt-6 pt-4 border-t border-ds-border">
          <p className="text-xs text-ds-muted-foreground">{t(locale, "returns.tracking_number")}</p>
          <p className="text-lg font-mono font-bold text-ds-foreground tracking-widest">{trackingNumber}</p>
        </div>

        {barcode && (
          <div className="mt-4 bg-ds-muted rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-0.5 mb-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-ds-foreground"
                    style={{
                      width: `${Math.random() > 0.5 ? 2 : 1}px`,
                      height: "40px",
                    }}
                  />
                ))}
              </div>
              <p className="text-xs font-mono text-ds-muted-foreground">{barcode}</p>
            </div>
          </div>
        )}
      </div>

      {onPrint && (
        <div className="p-4 border-t border-ds-border bg-ds-muted/50">
          <button
            onClick={onPrint}
            className="w-full px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008h-.008V12z" />
            </svg>
            {t(locale, "returns.print_label")}
          </button>
        </div>
      )}
    </div>
  )
}
