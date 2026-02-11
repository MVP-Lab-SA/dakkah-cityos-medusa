import { useState } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface AgeVerificationFormProps {
  minimumAge: number
  onSubmit: (data: { method: "dob" | "document"; dob?: string; document?: File }) => void
  onCancel?: () => void
  allowedMethods?: ("dob" | "document")[]
  isSubmitting?: boolean
  locale?: string
  className?: string
}

export function AgeVerificationForm({
  minimumAge,
  onSubmit,
  onCancel,
  allowedMethods = ["dob"],
  isSubmitting = false,
  locale: localeProp,
  className,
}: AgeVerificationFormProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [method, setMethod] = useState<"dob" | "document">(allowedMethods[0] || "dob")
  const [dobValue, setDobValue] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = () => {
    setError("")
    if (method === "dob") {
      if (!dobValue) {
        setError(t(locale, "ageVerification.invalid_date"))
        return
      }
      const dob = new Date(dobValue)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }
      if (age < minimumAge) {
        setError(t(locale, "ageVerification.under_age").replace("{age}", String(minimumAge)))
        return
      }
      onSubmit({ method: "dob", dob: dobValue })
    } else {
      if (!selectedFile) {
        setError(t(locale, "ageVerification.upload_required"))
        return
      }
      onSubmit({ method: "document", document: selectedFile })
    }
  }

  return (
    <div className={clsx("bg-ds-card border border-ds-border rounded-xl p-6", className)}>
      <h3 className="text-lg font-semibold text-ds-foreground mb-1">
        {t(locale, "ageVerification.enter_dob")}
      </h3>
      <p className="text-sm text-ds-muted-foreground mb-6">
        {t(locale, "ageVerification.minimum_age").replace("{age}", String(minimumAge))}
      </p>

      {allowedMethods.length > 1 && (
        <div className="flex gap-2 mb-6">
          {allowedMethods.map((m) => (
            <button
              key={m}
              onClick={() => { setMethod(m); setError("") }}
              className={clsx(
                "flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
                method === m
                  ? "bg-ds-primary text-ds-primary-foreground border-ds-primary"
                  : "bg-ds-background text-ds-foreground border-ds-border hover:bg-ds-muted"
              )}
            >
              {m === "dob" ? t(locale, "ageVerification.method_dob") : t(locale, "ageVerification.method_document")}
            </button>
          ))}
        </div>
      )}

      {method === "dob" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ds-foreground mb-1 text-start">
              {t(locale, "ageVerification.enter_dob")}
            </label>
            <input
              type="date"
              value={dobValue}
              onChange={(e) => { setDobValue(e.target.value); setError("") }}
              className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ds-foreground mb-1 text-start">
              {t(locale, "ageVerification.method_document")}
            </label>
            <div className="border-2 border-dashed border-ds-border rounded-lg p-6 text-center hover:border-ds-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => { setSelectedFile(e.target.files?.[0] || null); setError("") }}
                className="hidden"
                id="doc-upload"
              />
              <label htmlFor="doc-upload" className="cursor-pointer">
                <span className="text-3xl block mb-2">📄</span>
                <p className="text-sm text-ds-muted-foreground">
                  {selectedFile ? selectedFile.name : t(locale, "ageVerification.method_document")}
                </p>
              </label>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-ds-destructive mt-3">{error}</p>
      )}

      <div className="flex gap-3 mt-6">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium bg-ds-muted text-ds-foreground rounded-lg hover:bg-ds-background transition-colors"
          >
            {t(locale, "blocks.cancel")}
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? "..." : t(locale, "ageVerification.verify")}
        </button>
      </div>
    </div>
  )
}
