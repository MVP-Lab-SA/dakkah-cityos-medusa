import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface SizeOption {
  value: string
  label: string
  chest?: string
  waist?: string
  hips?: string
}

interface FitFinderProps {
  locale?: string
  sizes: SizeOption[]
  productType?: string
  onSizeSelect?: (size: string) => void
}

export function FitFinder({ locale: localeProp, sizes, productType = "tops", onSizeSelect }: FitFinderProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [unit, setUnit] = useState<"cm" | "in">("cm")
  const [measurements, setMeasurements] = useState({ chest: "", waist: "", hips: "" })
  const [recommended, setRecommended] = useState<string | null>(null)

  const findSize = () => {
    const chest = parseFloat(measurements.chest)
    const waist = parseFloat(measurements.waist)
    if (isNaN(chest) && isNaN(waist)) return

    let best: SizeOption | null = null
    let bestDiff = Infinity

    for (const size of sizes) {
      const sChest = parseFloat(size.chest || "0")
      const sWaist = parseFloat(size.waist || "0")
      let diff = 0
      if (!isNaN(chest) && sChest) diff += Math.abs(chest - sChest)
      if (!isNaN(waist) && sWaist) diff += Math.abs(waist - sWaist)
      if (diff < bestDiff) {
        bestDiff = diff
        best = size
      }
    }

    if (best) {
      setRecommended(best.value)
      onSizeSelect?.(best.value)
    }
  }

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-ds-text">{t(locale, "productDisplay.fit_finder")}</h3>
        <div className="flex items-center gap-1 bg-ds-accent rounded-md p-0.5">
          {(["cm", "in"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-2 py-1 text-xs rounded ${
                unit === u ? "bg-ds-card text-ds-text shadow-sm" : "text-ds-muted"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {(["chest", "waist", "hips"] as const).map((field) => (
          <div key={field}>
            <label className="block text-xs text-ds-muted mb-1">
              {t(locale, `productDisplay.${field}`)}
            </label>
            <div className="relative">
              <input
                type="number"
                value={measurements[field]}
                onChange={(e) => setMeasurements((prev) => ({ ...prev, [field]: e.target.value }))}
                placeholder="0"
                className="w-full px-3 py-2 pe-8 text-sm bg-ds-accent border border-ds-border rounded-md text-ds-text placeholder:text-ds-muted focus:outline-none focus:ring-1 focus:ring-ds-primary"
              />
              <span className="absolute end-2 top-1/2 -translate-y-1/2 text-xs text-ds-muted">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={findSize}
        className="w-full px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-md hover:opacity-90 transition-opacity mb-4"
      >
        {t(locale, "productDisplay.find_my_size")}
      </button>

      {recommended && (
        <div className="bg-ds-success/10 border border-ds-success/20 rounded-md p-3 text-center">
          <p className="text-sm text-ds-success font-medium">
            {t(locale, "productDisplay.recommended_size")}: {recommended}
          </p>
        </div>
      )}

      <div className="mt-4">
        <h4 className="text-xs font-medium text-ds-muted mb-2">{t(locale, "productDisplay.size_chart")}</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ds-border">
                <th className="py-1.5 pe-3 text-start text-ds-muted font-medium">{t(locale, "productDisplay.size")}</th>
                <th className="py-1.5 px-3 text-start text-ds-muted font-medium">{t(locale, "productDisplay.chest")}</th>
                <th className="py-1.5 px-3 text-start text-ds-muted font-medium">{t(locale, "productDisplay.waist")}</th>
                <th className="py-1.5 ps-3 text-start text-ds-muted font-medium">{t(locale, "productDisplay.hips")}</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr
                  key={size.value}
                  className={`border-b border-ds-border last:border-0 ${
                    recommended === size.value ? "bg-ds-success/5" : ""
                  }`}
                >
                  <td className="py-1.5 pe-3 font-medium text-ds-text">{size.label}</td>
                  <td className="py-1.5 px-3 text-ds-muted">{size.chest || "-"}</td>
                  <td className="py-1.5 px-3 text-ds-muted">{size.waist || "-"}</td>
                  <td className="py-1.5 ps-3 text-ds-muted">{size.hips || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
