import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface ARPreviewProps {
  locale?: string
  productName: string
  productImage?: string
  arUrl?: string
}

export function ARPreview({ locale: localeProp, productName, productImage, arUrl }: ARPreviewProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="text-sm font-semibold text-ds-text">{t(locale, "productDisplay.ar_preview")}</h3>
      </div>

      <div className="aspect-video bg-ds-accent rounded-lg flex flex-col items-center justify-center gap-4 mb-4">
        {productImage ? (
          <img src={productImage} alt={productName} className="max-h-32 object-contain opacity-50" />
        ) : (
          <svg className="w-16 h-16 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )}
        <div className="text-center">
          <p className="text-sm font-medium text-ds-text">{t(locale, "productDisplay.ar_scan_qr")}</p>
          <p className="text-xs text-ds-muted mt-1">{t(locale, "productDisplay.ar_open_phone")}</p>
        </div>
      </div>

      <div className="bg-ds-accent rounded-lg p-4 flex items-center justify-center">
        <div className="w-24 h-24 bg-ds-card border-2 border-ds-border rounded-lg flex items-center justify-center">
          <svg className="w-16 h-16 text-ds-muted" viewBox="0 0 100 100" fill="currentColor">
            <rect x="10" y="10" width="30" height="30" />
            <rect x="60" y="10" width="30" height="30" />
            <rect x="10" y="60" width="30" height="30" />
            <rect x="45" y="45" width="10" height="10" />
            <rect x="60" y="60" width="10" height="10" />
            <rect x="75" y="75" width="15" height="15" />
            <rect x="60" y="75" width="10" height="10" />
            <rect x="75" y="60" width="10" height="10" />
          </svg>
        </div>
      </div>

      {arUrl && (
        <a
          href={arUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full text-center px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          {t(locale, "productDisplay.ar_open_viewer")}
        </a>
      )}
    </div>
  )
}
