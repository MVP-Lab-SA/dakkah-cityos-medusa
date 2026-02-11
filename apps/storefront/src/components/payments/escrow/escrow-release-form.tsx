import { useState } from "react"
import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface EscrowReleaseFormProps {
  escrowId: string
  amount: number
  currency?: string
  onRelease: (data: { escrowId: string; notes?: string }) => void
  onDispute?: () => void
  onCancel: () => void
  locale?: string
  loading?: boolean
}

export function EscrowReleaseForm({
  escrowId,
  amount,
  currency = "USD",
  onRelease,
  onDispute,
  onCancel,
  locale: localeProp,
  loading = false,
}: EscrowReleaseFormProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const loc = locale as SupportedLocale
  const [notes, setNotes] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmed) return
    onRelease({ escrowId, notes: notes.trim() || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ds-background rounded-xl border border-ds-border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-ds-foreground">{t(locale, "escrow.release_funds")}</h3>
        <p className="text-sm text-ds-muted-foreground mt-1">
          {t(locale, "escrow.release_description")}
        </p>
      </div>

      <div className="bg-ds-muted rounded-lg p-4">
        <p className="text-sm text-ds-muted-foreground mb-1">{t(locale, "escrow.amount_to_release")}</p>
        <p className="text-2xl font-bold text-ds-foreground">{formatCurrency(amount, currency, loc)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-2">
          {t(locale, "escrow.notes")}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={t(locale, "escrow.notes_placeholder")}
          className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 rounded border-ds-border text-ds-primary focus:ring-ds-primary"
        />
        <span className="text-sm text-ds-foreground">{t(locale, "escrow.confirm_release")}</span>
      </label>

      <div className="flex gap-3 justify-end">
        {onDispute && (
          <button
            type="button"
            onClick={onDispute}
            className="px-4 py-2 text-sm font-medium text-ds-destructive bg-ds-destructive/10 border border-ds-destructive/20 rounded-lg hover:bg-ds-destructive/20 transition-colors"
          >
            {t(locale, "escrow.file_dispute")}
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-ds-foreground bg-ds-background border border-ds-border rounded-lg hover:bg-ds-muted transition-colors"
        >
          {t(locale, "common.cancel")}
        </button>
        <button
          type="submit"
          disabled={!confirmed || loading}
          className="px-4 py-2 text-sm font-semibold bg-ds-success text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t(locale, "common.loading") : t(locale, "escrow.release_funds")}
        </button>
      </div>
    </form>
  )
}
