import { useState, useRef } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface DisputeFormProps {
  orderId: string
  reasons: string[]
  onSubmit: (data: { reason: string; description: string; evidence?: File[] }) => void
  onCancel: () => void
  locale?: string
  loading?: boolean
}

export function DisputeFormComponent({
  orderId,
  reasons,
  onSubmit,
  onCancel,
  locale: localeProp,
  loading = false,
}: DisputeFormProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason || !description) return
    onSubmit({ reason, description, evidence: files.length > 0 ? files : undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ds-background rounded-xl border border-ds-border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-ds-foreground">{t(locale, "disputes.file_dispute")}</h3>
        <p className="text-sm text-ds-muted-foreground mt-1">
          {t(locale, "disputes.order")} #{orderId}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-2">
          {t(locale, "disputes.reason")}
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
        >
          <option value="">{t(locale, "disputes.select_reason")}</option>
          {reasons.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-2">
          {t(locale, "disputes.description")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder={t(locale, "disputes.describe_issue")}
          className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-2">
          {t(locale, "disputes.evidence")}
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-ds-border rounded-lg p-6 text-center cursor-pointer hover:border-ds-primary/50 hover:bg-ds-muted/50 transition-colors"
        >
          <p className="text-sm text-ds-muted-foreground">{t(locale, "disputes.drag_drop")}</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between px-3 py-2 bg-ds-muted rounded-lg">
                <span className="text-sm text-ds-foreground truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-ds-destructive text-sm font-medium ms-2 flex-shrink-0 hover:underline"
                >
                  {t(locale, "disputes.remove")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-ds-foreground bg-ds-background border border-ds-border rounded-lg hover:bg-ds-muted transition-colors"
        >
          {t(locale, "common.cancel")}
        </button>
        <button
          type="submit"
          disabled={!reason || !description || loading}
          className="px-4 py-2 text-sm font-semibold bg-ds-destructive text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t(locale, "common.loading") : t(locale, "disputes.submit_dispute")}
        </button>
      </div>
    </form>
  )
}
