import { useState, useRef } from "react"
import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"

interface SupportTicketFormProps {
  onSubmit?: (data: {
    subject: string
    description: string
    priority: "low" | "medium" | "high" | "urgent"
    category?: string
    attachments?: File[]
  }) => void
  categories?: string[]
  locale?: string
}

export function SupportTicketForm({
  onSubmit,
  categories = [],
  locale: localeProp,
}: SupportTicketFormProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [category, setCategory] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      subject,
      description,
      priority,
      category: category || undefined,
      attachments: files.length > 0 ? files : undefined,
    })
    setSubmitted(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  if (submitted) {
    return (
      <div className="bg-ds-background rounded-lg border border-ds-border p-8 text-center">
        <span className="text-4xl block mb-4">✅</span>
        <h3 className="text-lg font-semibold text-ds-foreground mb-2">
          {t(locale, "faq.ticket_submitted")}
        </h3>
        <p className="text-sm text-ds-muted-foreground">
          {t(locale, "faq.ticket_submitted_description")}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ds-background rounded-lg border border-ds-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-ds-foreground mb-2">
        {t(locale, "faq.submit_ticket")}
      </h3>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-1">
          {t(locale, "faq.subject")}
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full px-3 py-2 text-sm rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
          placeholder={t(locale, "faq.subject_placeholder")}
        />
      </div>

      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1">
            {t(locale, "faq.category")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
          >
            <option value="">{t(locale, "faq.select_category")}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-1">
          {t(locale, "faq.priority")}
        </label>
        <div className="flex gap-2">
          {(["low", "medium", "high", "urgent"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                priority === p
                  ? "bg-ds-primary text-ds-primary-foreground border-ds-primary"
                  : "bg-ds-background text-ds-muted-foreground border-ds-border hover:bg-ds-muted"
              }`}
            >
              {t(locale, `faq.priority_${p}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-1">
          {t(locale, "faq.description")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          className="w-full px-3 py-2 text-sm rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
          placeholder={t(locale, "faq.description_placeholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-1">
          {t(locale, "faq.attachments")}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-sm font-medium bg-ds-muted text-ds-muted-foreground rounded-lg border border-ds-border hover:bg-ds-background transition-colors"
        >
          {t(locale, "faq.upload_files")}
        </button>
        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((file, i) => (
              <p key={i} className="text-xs text-ds-muted-foreground">{file.name}</p>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2.5 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        {t(locale, "common.submit")}
      </button>
    </form>
  )
}
