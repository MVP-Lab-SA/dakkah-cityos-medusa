// @ts-nocheck
import { useState } from "react"
import { t } from "../../lib/i18n"
import EvidenceUploader from "./evidence-uploader"

interface DisputeData {
  orderId: string
  reason: string
  description: string
  evidence: File[]
}

interface DisputeFormProps {
  orderId: string
  locale: string
  onSubmit?: (data: DisputeData) => void
  onCancel?: () => void
}

const REASON_OPTIONS = [
  "defective",
  "not_received",
  "wrong_item",
  "unauthorized",
  "other",
] as const

export default function DisputeForm({
  orderId,
  locale,
  onSubmit,
  onCancel,
}: DisputeFormProps) {
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [evidence, setEvidence] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason || !description.trim()) return
    setSubmitting(true)
    try {
      onSubmit?.({ orderId, reason, description, evidence })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      aria-label="File dispute form"
      onSubmit={handleSubmit}
      className="bg-ds-card rounded-xl border border-ds-border p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-ds-foreground">
          {t(locale, "disputes.file_dispute")}
        </h3>
        <p className="text-sm text-ds-muted-foreground mt-1">
          {t(locale, "disputes.order")} #{orderId}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1.5">
            {t(locale, "disputes.reason")}
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full rounded-lg border border-ds-border bg-ds-surface px-3 py-2 text-sm text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
          >
            <option value="">{t(locale, "disputes.select_reason")}</option>
            {REASON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {t(locale, `disputes.reasons.${opt}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1.5">
            {t(locale, "disputes.description")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder={t(locale, "disputes.description_placeholder")}
            className="w-full rounded-lg border border-ds-border bg-ds-surface px-3 py-2 text-sm text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1.5">
            {t(locale, "disputes.evidence")}
          </label>
          <EvidenceUploader
            onFilesSelected={setEvidence}
            maxFiles={5}
            locale={locale}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-ds-foreground bg-ds-muted rounded-lg hover:opacity-80 transition-opacity"
          >
            {t(locale, "disputes.cancel")}
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || !reason || !description.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-ds-primary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? t(locale, "disputes.submitting")
            : t(locale, "disputes.submit")}
        </button>
      </div>
    </form>
  )
}
