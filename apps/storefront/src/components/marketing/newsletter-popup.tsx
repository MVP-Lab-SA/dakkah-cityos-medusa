import { useState, useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface NewsletterPopupProps {
  locale?: string
  delay?: number
  onSubscribe?: (email: string) => void
  title?: string
  description?: string
  discountText?: string
}

export function NewsletterPopup({
  locale: localeProp,
  delay = 5000,
  onSubscribe,
  title,
  description,
  discountText,
}: NewsletterPopupProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const dismissed = sessionStorage.getItem("newsletter_dismissed")
    if (dismissed) return
    const timer = setTimeout(() => setIsOpen(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const handleClose = () => {
    setIsOpen(false)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("newsletter_dismissed", "1")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    onSubscribe?.(email)
    setSubmitted(true)
    setTimeout(handleClose, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />
      <div
        className="relative bg-ds-card border border-ds-border rounded-xl shadow-xl max-w-md w-full p-6"
        role="dialog"
        aria-modal="true"
        aria-label={title || t(locale, "marketing.newsletter_title")}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 end-3 p-2 text-ds-muted hover:text-ds-text transition-colors"
          aria-label={t(locale, "common.close")}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-ds-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-ds-text">
            {title || t(locale, "marketing.newsletter_title")}
          </h2>
          <p className="text-sm text-ds-muted mt-1">
            {description || t(locale, "marketing.newsletter_desc")}
          </p>
          {discountText && (
            <div className="mt-3 inline-block bg-ds-primary/10 text-ds-primary px-3 py-1 rounded-full text-sm font-medium">
              {discountText}
            </div>
          )}
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <svg className="w-10 h-10 text-ds-success mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-ds-success">{t(locale, "blocks.subscribe_success")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(locale, "blocks.subscribe_placeholder")}
              required
              className="w-full px-4 py-2.5 text-sm bg-ds-accent border border-ds-border rounded-lg text-ds-text placeholder:text-ds-muted focus:outline-none focus:ring-2 focus:ring-ds-primary"
            />
            <button
              type="submit"
              className="w-full px-4 py-2.5 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t(locale, "blocks.subscribe")}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
