import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface NewsletterSignupProps {
  locale?: string
  className?: string
  title?: string
  description?: string
  incentive?: string
  onSubscribe?: (email: string) => Promise<void> | void
  variant?: "inline" | "card" | "minimal"
}

export function NewsletterSignup({
  locale: localeProp,
  className = "",
  title,
  description,
  incentive,
  onSubscribe,
  variant = "card",
}: NewsletterSignupProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    try {
      await onSubscribe?.(email.trim())
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className={`text-center p-6 bg-ds-card border border-ds-border rounded-lg ${className}`}>
        <div className="w-12 h-12 bg-ds-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-ds-text mb-1">
          {t(locale, "marketing.subscribe_success")}
        </h3>
        <p className="text-sm text-ds-muted">
          {t(locale, "marketing.subscribe_success_desc")}
        </p>
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t(locale, "marketing.email_placeholder")}
          required
          className="flex-1 bg-ds-background border border-ds-border rounded-md px-3 py-2 text-sm text-ds-text placeholder:text-ds-muted focus:outline-none focus:ring-1 focus:ring-ds-primary"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {status === "loading" ? t(locale, "common.loading") : t(locale, "marketing.subscribe_btn")}
        </button>
      </form>
    )
  }

  const isInline = variant === "inline"

  return (
    <div className={`${isInline ? "" : "bg-ds-card border border-ds-border rounded-lg p-6"} ${className}`}>
      <div className={isInline ? "flex flex-wrap items-center gap-4" : "text-center"}>
        <div className={isInline ? "flex-1 min-w-0" : "mb-4"}>
          {!isInline && (
            <div className="w-10 h-10 bg-ds-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <h3 className={`font-semibold text-ds-text ${isInline ? "text-sm" : "text-base mb-1"}`}>
            {title || t(locale, "marketing.newsletter_title")}
          </h3>
          <p className={`text-ds-muted ${isInline ? "text-xs" : "text-sm"}`}>
            {description || t(locale, "marketing.newsletter_desc")}
          </p>
          {incentive && (
            <p className="text-xs font-medium text-ds-primary mt-1">{incentive}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className={`flex gap-2 ${isInline ? "flex-shrink-0" : "mt-4 max-w-sm mx-auto"}`}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t(locale, "marketing.email_placeholder")}
            required
            className="flex-1 bg-ds-background border border-ds-border rounded-md px-3 py-2 text-sm text-ds-text placeholder:text-ds-muted focus:outline-none focus:ring-1 focus:ring-ds-primary min-w-0"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity flex-shrink-0"
          >
            {status === "loading" ? t(locale, "common.loading") : t(locale, "marketing.subscribe_btn")}
          </button>
        </form>

        {status === "error" && (
          <p className="text-xs text-ds-destructive mt-2">{t(locale, "marketing.subscribe_error")}</p>
        )}
      </div>
    </div>
  )
}
