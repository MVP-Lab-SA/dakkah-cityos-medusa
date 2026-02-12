import React, { useState } from "react"

interface DeliveryInstructionsProps {
  initialNotes?: string
  initialSaveAsDefault?: boolean
  maxLength?: number
  onChange?: (notes: string, saveAsDefault: boolean) => void
}

const quickInstructions = [
  { id: "door", label: "Leave at door", icon: "🚪" },
  { id: "bell", label: "Ring bell", icon: "🔔" },
  { id: "call", label: "Call on arrival", icon: "📞" },
  { id: "neighbor", label: "Leave with neighbor", icon: "🏠" },
]

export function DeliveryInstructions({
  initialNotes = "",
  initialSaveAsDefault = false,
  maxLength = 500,
  onChange,
}: DeliveryInstructionsProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [saveAsDefault, setSaveAsDefault] = useState(initialSaveAsDefault)

  const handleNotesChange = (value: string) => {
    if (value.length > maxLength) return
    setNotes(value)
    onChange?.(value, saveAsDefault)
  }

  const handleQuickSelect = (label: string) => {
    const current = notes.trim()
    const updated = current ? `${current}\n${label}` : label
    if (updated.length > maxLength) return
    setNotes(updated)
    onChange?.(updated, saveAsDefault)
  }

  const handleSaveToggle = () => {
    const next = !saveAsDefault
    setSaveAsDefault(next)
    onChange?.(notes, next)
  }

  const remaining = maxLength - notes.length

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-sm font-semibold text-ds-foreground">Delivery Instructions</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickInstructions.map((qi) => (
          <button
            key={qi.id}
            type="button"
            onClick={() => handleQuickSelect(qi.label)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-ds-border text-ds-muted-foreground hover:bg-ds-muted hover:text-ds-foreground transition-colors"
          >
            <span>{qi.icon}</span>
            {qi.label}
          </button>
        ))}
      </div>

      <div>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={3}
          maxLength={maxLength}
          placeholder="Add any specific delivery instructions..."
          className="w-full px-3 py-2 text-sm bg-ds-muted border border-ds-border rounded-md text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary resize-none"
        />
        <div className="flex items-center justify-between mt-1">
          <span
            className={`text-xs ${remaining < 50 ? "text-ds-destructive" : "text-ds-muted-foreground"}`}
          >
            {remaining} characters remaining
          </span>
          <span className="text-xs text-ds-muted-foreground">{notes.length}/{maxLength}</span>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={saveAsDefault}
          onChange={handleSaveToggle}
          className="w-4 h-4 rounded border-ds-border text-ds-primary focus:ring-ds-primary"
        />
        <span className="text-sm text-ds-muted-foreground">Save as default for future orders</span>
      </label>
    </div>
  )
}
