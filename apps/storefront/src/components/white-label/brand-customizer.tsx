import { t } from "@/lib/i18n"
import { useState } from "react"

export interface BrandConfig {
  brandName: string
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export function BrandCustomizer({
  locale,
  initialConfig,
  onSave,
}: {
  locale: string
  initialConfig?: Partial<BrandConfig>
  onSave?: (config: BrandConfig) => void
}) {
  const [config, setConfig] = useState<BrandConfig>({
    brandName: initialConfig?.brandName || "",
    logoUrl: initialConfig?.logoUrl,
    primaryColor: initialConfig?.primaryColor || "#000000",
    secondaryColor: initialConfig?.secondaryColor || "#666666",
    accentColor: initialConfig?.accentColor || "#0066ff",
  })

  return (
    <div className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-ds-foreground">
        {t(locale, "whiteLabel.brand_customizer")}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1.5">
            {t(locale, "whiteLabel.brand_name")}
          </label>
          <input
            type="text"
            value={config.brandName}
            onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
            placeholder={t(locale, "whiteLabel.brand_name_placeholder")}
            className="w-full px-4 py-2.5 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1.5">
            {t(locale, "whiteLabel.logo")}
          </label>
          <div className="border-2 border-dashed border-ds-border rounded-lg p-6 text-center hover:border-ds-ring transition-colors">
            {config.logoUrl ? (
              <img loading="lazy" src={config.logoUrl} alt="Logo" className="mx-auto h-16 object-contain" />
            ) : (
              <div className="space-y-2">
                <svg className="w-10 h-10 text-ds-muted-foreground/40 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm text-ds-muted-foreground">
                  {t(locale, "whiteLabel.upload_logo")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1.5">
            {t(locale, "whiteLabel.colors")}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "primaryColor", label: "whiteLabel.primary_color" },
              { key: "secondaryColor", label: "whiteLabel.secondary_color" },
              { key: "accentColor", label: "whiteLabel.accent_color" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <p className="text-xs text-ds-muted-foreground">{t(locale, label)}</p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config[key as keyof BrandConfig] as string}
                    onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                    className="w-8 h-8 rounded border border-ds-border cursor-pointer"
                  />
                  <span className="text-xs text-ds-muted-foreground">
                    {config[key as keyof BrandConfig] as string}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSave?.(config)}
        className="w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary/90 transition-colors"
      >
        {t(locale, "whiteLabel.save_branding")}
      </button>
    </div>
  )
}
