import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface OrderNotesProps {
  locale?: string
  onNotesChange?: (notes: string) => void
  maxLength?: number
}

export function OrderNotes({ locale: localeProp, onNotesChange, maxLength = 500 }: OrderNotesProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [notes, setNotes] = useState("")
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-start hover:bg-ds-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-sm font-medium text-ds-text">{t(locale, "checkout.order_notes")}</span>
          {notes && (
            <span className="w-2 h-2 bg-ds-primary rounded-full" />
          )}
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
        <div className="border-t border-ds-border p-4">
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value)
              onNotesChange?.(e.target.value)
            }}
            rows={3}
            maxLength={maxLength}
            placeholder={t(locale, "checkout.order_notes_placeholder")}
            className="w-full px-3 py-2 text-sm bg-ds-accent border border-ds-border rounded-md text-ds-text placeholder:text-ds-muted focus:outline-none focus:ring-1 focus:ring-ds-primary resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-ds-muted">{t(locale, "checkout.order_notes_hint")}</p>
            <p className="text-xs text-ds-muted">{notes.length}/{maxLength}</p>
          </div>
        </div>
      )}
    </div>
  )
}
