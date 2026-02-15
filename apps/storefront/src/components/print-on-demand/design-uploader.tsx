import { t } from "@/lib/i18n"

export function DesignUploader({
  locale,
  previewUrl,
  uploading,
  error,
  onUpload,
  onRemove,
}: {
  locale: string
  previewUrl?: string
  uploading?: boolean
  error?: string
  onUpload?: (file: File) => void
  onRemove?: () => void
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload?.(file)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-ds-foreground">
        {t(locale, "printOnDemand.upload_design")}
      </h3>

      {previewUrl ? (
        <div className="relative bg-ds-muted rounded-xl overflow-hidden">
          <img loading="lazy" src={previewUrl} alt="Design preview" className="w-full aspect-square object-contain p-4" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 end-2 w-8 h-8 rounded-full bg-ds-destructive text-ds-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <label className="block border-2 border-dashed border-ds-border rounded-xl p-8 text-center hover:border-ds-ring transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={handleFileChange}
            className="sr-only"
          />
          {uploading ? (
            <div className="space-y-2">
              <div className="w-10 h-10 border-2 border-ds-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-ds-muted-foreground">{t(locale, "printOnDemand.uploading")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <svg className="w-12 h-12 text-ds-muted-foreground/40 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm font-medium text-ds-foreground">
                {t(locale, "printOnDemand.drag_drop_design")}
              </p>
              <p className="text-xs text-ds-muted-foreground">
                {t(locale, "printOnDemand.accepted_formats")}
              </p>
            </div>
          )}
        </label>
      )}

      {error && (
        <p className="text-sm text-ds-destructive">{error}</p>
      )}
    </div>
  )
}
