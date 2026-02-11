import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface MaterialSpec {
  label: string
  value: string
}

interface MaterialInfoProps {
  locale?: string
  materialName: string
  description?: string
  specs: MaterialSpec[]
  careInstructions?: string[]
  certifications?: string[]
}

export function MaterialInfo({
  locale: localeProp,
  materialName,
  description,
  specs,
  careInstructions,
  certifications,
}: MaterialInfoProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-start hover:bg-ds-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span className="text-sm font-medium text-ds-text">
            {t(locale, "productDisplay.material_info")}: {materialName}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-ds-muted transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-ds-border p-4 space-y-4">
          {description && <p className="text-sm text-ds-muted">{description}</p>}

          <div className="grid grid-cols-2 gap-3">
            {specs.map((spec, i) => (
              <div key={i} className="bg-ds-accent/50 rounded-md p-3">
                <p className="text-xs text-ds-muted">{spec.label}</p>
                <p className="text-sm font-medium text-ds-text mt-0.5">{spec.value}</p>
              </div>
            ))}
          </div>

          {careInstructions && careInstructions.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-ds-muted mb-2">
                {t(locale, "productDisplay.care_instructions")}
              </h4>
              <ul className="space-y-1">
                {careInstructions.map((inst, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ds-text">
                    <svg className="w-4 h-4 text-ds-muted mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    {inst}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-ds-success/10 text-ds-success text-xs font-medium rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {cert}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
