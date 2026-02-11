import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface SizePrediction {
  size: string
  confidence: number
  fit: "tight" | "regular" | "loose"
}

interface SizePredictorProps {
  locale?: string
  className?: string
  predictions?: SizePrediction[]
  recommendedSize?: string
  onSelectSize?: (size: string) => void
}

export function SizePredictor({
  locale: localeProp,
  className = "",
  predictions = [],
  recommendedSize,
  onSelectSize,
}: SizePredictorProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [selectedSize, setSelectedSize] = useState(recommendedSize || "")

  const fitIcons: Record<string, React.ReactNode> = {
    tight: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l-2 2m0 0l2 2m-2-2h10m-6-6V4m0 16v-4" />
      </svg>
    ),
    regular: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    loose: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  }

  const handleSelect = (size: string) => {
    setSelectedSize(size)
    onSelectSize?.(size)
  }

  return (
    <div className={`bg-ds-card border border-ds-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="text-sm font-semibold text-ds-text">
          {t(locale, "productDisplay.size_predictor")}
        </h3>
        <span className="ms-auto text-[10px] font-medium px-1.5 py-0.5 bg-ds-primary/10 text-ds-primary rounded-full">
          AI
        </span>
      </div>

      {recommendedSize && (
        <div className="mb-3 p-3 bg-ds-success/10 border border-ds-success/20 rounded-md">
          <p className="text-sm text-ds-success font-medium">
            {t(locale, "productDisplay.recommended_size")}: {recommendedSize}
          </p>
          <p className="text-xs text-ds-muted mt-0.5">
            {t(locale, "productDisplay.based_on_profile")}
          </p>
        </div>
      )}

      {predictions.length > 0 && (
        <div className="space-y-2">
          {predictions.map((pred) => (
            <button
              key={pred.size}
              onClick={() => handleSelect(pred.size)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-md border transition-colors ${
                selectedSize === pred.size
                  ? "border-ds-primary bg-ds-primary/5"
                  : "border-ds-border hover:border-ds-primary/50"
              }`}
            >
              <span className="text-sm font-bold text-ds-text w-10">{pred.size}</span>
              <div className="flex-1">
                <div className="w-full bg-ds-accent rounded-full h-1.5">
                  <div
                    className="bg-ds-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${pred.confidence}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-ds-muted tabular-nums w-10 text-end">
                {pred.confidence}%
              </span>
              <span className={`flex items-center gap-1 text-xs ${
                pred.fit === "regular" ? "text-ds-success" : "text-ds-muted"
              }`}>
                {fitIcons[pred.fit]}
                {t(locale, `productDisplay.fit_${pred.fit}`)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
