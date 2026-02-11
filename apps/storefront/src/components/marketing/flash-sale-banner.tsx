import { useState, useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface FlashSaleBannerProps {
  locale?: string
  title?: string
  endDate: string | Date
  ctaText?: string
  ctaHref?: string
  onCtaClick?: () => void
  dismissible?: boolean
}

export function FlashSaleBanner({
  locale: localeProp,
  title,
  endDate,
  ctaText,
  ctaHref,
  onCtaClick,
  dismissible = true,
}: FlashSaleBannerProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [dismissed, setDismissed] = useState(false)
  const target = typeof endDate === "string" ? new Date(endDate) : endDate
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, expired: false })

  useEffect(() => {
    function calc() {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true }
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        expired: false,
      }
    }
    setTimeLeft(calc())
    const timer = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(timer)
  }, [target])

  if (dismissed || timeLeft.expired) return null

  return (
    <div className="bg-ds-destructive text-white py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-sm font-semibold">
            {title || t(locale, "marketing.flash_sale")}
          </span>
        </div>

        <div className="flex items-center gap-1 font-mono">
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-sm font-bold tabular-nums">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="font-bold">:</span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-sm font-bold tabular-nums">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="font-bold">:</span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-sm font-bold tabular-nums">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>

        {(ctaText || ctaHref) && (
          <a
            href={ctaHref || "#"}
            onClick={(e) => {
              if (onCtaClick) { e.preventDefault(); onCtaClick() }
            }}
            className="px-3 py-1 bg-white text-ds-destructive text-xs font-semibold rounded-full hover:bg-white/90 transition-colors"
          >
            {ctaText || t(locale, "marketing.shop_now")}
          </a>
        )}

        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute end-4 p-1 text-white/70 hover:text-white"
            aria-label={t(locale, "common.close")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
