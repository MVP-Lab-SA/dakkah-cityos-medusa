import { t } from "@/lib/i18n"

export interface LabelDesign {
  id: string
  name: string
  thumbnail: string
  premium?: boolean
}

export function LabelDesignPicker({
  designs,
  selectedDesignId,
  locale,
  onSelect,
  allowCustomUpload,
}: {
  designs: LabelDesign[]
  selectedDesignId?: string
  locale: string
  onSelect?: (designId: string) => void
  allowCustomUpload?: boolean
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ds-foreground">
        {t(locale, "whiteLabel.choose_design")}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {designs.map((design) => (
          <button
            key={design.id}
            type="button"
            onClick={() => onSelect?.(design.id)}
            className={`relative rounded-xl overflow-hidden border-2 transition-colors ${
              selectedDesignId === design.id
                ? "border-ds-primary ring-2 ring-ds-primary/20"
                : "border-ds-border hover:border-ds-ring"
            }`}
          >
            <div className="aspect-square bg-ds-muted">
              <img
                src={design.thumbnail}
                alt={design.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 bg-ds-background">
              <p className="text-xs font-medium text-ds-foreground truncate">{design.name}</p>
              {design.premium && (
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-ds-warning/20 text-ds-warning rounded-full mt-1">
                  {t(locale, "whiteLabel.premium")}
                </span>
              )}
            </div>
            {selectedDesignId === design.id && (
              <div className="absolute top-2 end-2 w-6 h-6 rounded-full bg-ds-primary text-ds-primary-foreground flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}

        {allowCustomUpload && (
          <button
            type="button"
            className="rounded-xl border-2 border-dashed border-ds-border hover:border-ds-ring transition-colors aspect-square flex flex-col items-center justify-center gap-2"
          >
            <svg className="w-8 h-8 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-xs text-ds-muted-foreground">
              {t(locale, "whiteLabel.upload_custom")}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
