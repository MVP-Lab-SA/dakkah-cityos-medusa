import { t } from "@/lib/i18n"

const angles = ["front", "back", "left", "right"] as const

export function MockupPreview({
  productImage,
  designImage,
  productTitle,
  variant,
  angle = "front",
  locale,
  onAngleChange,
}: {
  productImage: string
  designImage?: string
  productTitle: string
  variant?: string
  angle?: "front" | "back" | "left" | "right"
  locale: string
  onAngleChange?: (angle: "front" | "back" | "left" | "right") => void
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ds-foreground">
        {t(locale, "printOnDemand.mockup_preview")}
      </h3>

      <div className="relative bg-ds-muted rounded-xl overflow-hidden aspect-square">
        <img
          src={productImage}
          alt={productTitle}
          className="w-full h-full object-contain p-4"
        />
        {designImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={designImage}
              alt="Design overlay"
              className="max-w-[40%] max-h-[40%] object-contain opacity-90"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-ds-foreground">{productTitle}</p>
          {variant && (
            <p className="text-sm text-ds-muted-foreground">{variant}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {angles.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => onAngleChange?.(a)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              angle === a
                ? "border-ds-primary bg-ds-primary text-ds-primary-foreground"
                : "border-ds-border bg-ds-background text-ds-muted-foreground hover:border-ds-ring"
            }`}
          >
            {t(locale, `printOnDemand.angle_${a}`)}
          </button>
        ))}
      </div>
    </div>
  )
}
