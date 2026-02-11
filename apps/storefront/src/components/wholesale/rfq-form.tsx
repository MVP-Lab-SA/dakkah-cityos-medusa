import { useState } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface RFQFormData {
  companyName: string
  contactName: string
  email: string
  phone: string
  productInterest: string
  estimatedQuantity: string
  notes: string
}

interface RFQFormProps {
  locale?: string
  onSubmit?: (data: RFQFormData) => void
}

export function RFQForm({ locale: localeProp, onSubmit }: RFQFormProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<RFQFormData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    productInterest: "",
    estimatedQuantity: "",
    notes: "",
  })

  const handleChange = (field: keyof RFQFormData, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(form)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-ds-card rounded-lg border border-ds-border p-8 text-center">
        <div className="w-16 h-16 bg-ds-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-ds-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-ds-foreground mb-2">
          {t(locale, "wholesale.rfq_submitted")}
        </h3>
        <p className="text-sm text-ds-muted-foreground">
          {t(locale, "wholesale.rfq_submitted_desc")}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-ds-card rounded-lg border border-ds-border">
      <div className="p-4 border-b border-ds-border">
        <h3 className="font-semibold text-ds-foreground">
          {t(locale, "wholesale.rfq_title")}
        </h3>
        <p className="text-sm text-ds-muted-foreground mt-1">
          {t(locale, "wholesale.rfq_desc")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ds-foreground mb-1">
              {t(locale, "wholesale.company_name")}
            </label>
            <input
              type="text"
              required
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ds-foreground mb-1">
              {t(locale, "wholesale.contact_name")}
            </label>
            <input
              type="text"
              required
              value={form.contactName}
              onChange={(e) => handleChange("contactName", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ds-foreground mb-1">
              {t(locale, "wholesale.email")}
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ds-foreground mb-1">
              {t(locale, "wholesale.phone")}
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1">
            {t(locale, "wholesale.product_interest")}
          </label>
          <input
            type="text"
            required
            value={form.productInterest}
            onChange={(e) => handleChange("productInterest", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1">
            {t(locale, "wholesale.estimated_quantity")}
          </label>
          <input
            type="text"
            required
            value={form.estimatedQuantity}
            onChange={(e) => handleChange("estimatedQuantity", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1">
            {t(locale, "wholesale.additional_notes")}
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary/50 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t(locale, "wholesale.submit_rfq")}
        </button>
      </form>
    </div>
  )
}
