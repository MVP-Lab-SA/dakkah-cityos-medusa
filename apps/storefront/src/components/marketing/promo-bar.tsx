import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface PromoBarProps {
  locale?: string
  messages: string[]
  ctaText?: string
  ctaHref?: string
  onCtaClick?: () => void
  dismissible?: boolean
  variant?: "primary" | "accent" | "dark"
}

export function PromoBar({
  locale: localeProp,
  messages,
  ctaText,
  ctaHref,
  onCtaClick,
  dismissible = true,
  variant = "primary",
}: PromoBarProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [dismissed, setDismissed] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (dismissed || messages.length === 0) return null

  const variantClasses = {
    primary: "bg-ds-primary text-ds-primary-foreground",
    accent: "bg-ds-accent text-ds-text border-b border-ds-border",
    dark: "bg-ds-foreground text-white",
  }

  return (
    <div className={`relative py-2 px-4 ${variantClasses[variant]}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
        {messages.length > 1 && (
          <button
            onClick={() => setCurrentIndex((i) => (i - 1 + messages.length) % messages.length)}
            className="flex-shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label={t(locale, "blocks.previous_slide")}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <p className="text-xs sm:text-sm font-medium">
          {messages[currentIndex]}
          {ctaText && (
            <a
              href={ctaHref || "#"}
              onClick={(e) => {
                if (onCtaClick) { e.preventDefault(); onCtaClick() }
              }}
              className="underline ms-2 font-semibold hover:no-underline"
            >
              {ctaText}
            </a>
          )}
        </p>

        {messages.length > 1 && (
          <button
            onClick={() => setCurrentIndex((i) => (i + 1) % messages.length)}
            className="flex-shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label={t(locale, "blocks.next_slide")}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute end-3 top-1/2 -translate-y-1/2 p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label={t(locale, "common.close")}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
