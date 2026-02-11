import { useState, useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface CountdownTimerProps {
  locale?: string
  className?: string
  endDate: string | Date
  title?: string
  description?: string
  onExpire?: () => void
  variant?: "card" | "inline" | "banner"
}

export function CountdownTimer({
  locale: localeProp,
  className = "",
  endDate,
  title,
  description,
  onExpire,
  variant = "card",
}: CountdownTimerProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const target = typeof endDate === "string" ? new Date(endDate) : endDate

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  })

  useEffect(() => {
    function calc() {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        onExpire?.()
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        expired: false,
      }
    }
    setTimeLeft(calc())
    const timer = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(timer)
  }, [target])

  if (timeLeft.expired) return null

  const segments = [
    { value: timeLeft.days, label: t(locale, "marketing.days") },
    { value: timeLeft.hours, label: t(locale, "marketing.hours") },
    { value: timeLeft.minutes, label: t(locale, "marketing.minutes") },
    { value: timeLeft.seconds, label: t(locale, "marketing.seconds") },
  ]

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {title && <span className="text-sm font-medium text-ds-text">{title}</span>}
        <div className="flex items-center gap-1 font-mono">
          {segments.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="bg-ds-accent px-1.5 py-0.5 rounded text-sm font-bold text-ds-text tabular-nums">
                {String(seg.value).padStart(2, "0")}
              </span>
              {i < segments.length - 1 && <span className="text-ds-muted font-bold">:</span>}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (variant === "banner") {
    return (
      <div className={`bg-ds-primary text-ds-primary-foreground py-3 px-4 ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
          {title && <span className="text-sm font-semibold">{title}</span>}
          <div className="flex items-center gap-1 font-mono">
            {segments.map((seg, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-white/20 px-2 py-1 rounded text-sm font-bold tabular-nums">
                  {String(seg.value).padStart(2, "0")}
                </span>
                {i < segments.length - 1 && <span className="font-bold">:</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-ds-card border border-ds-border rounded-lg p-5 text-center ${className}`}>
      {title && <h3 className="text-base font-semibold text-ds-text mb-1">{title}</h3>}
      {description && <p className="text-sm text-ds-muted mb-4">{description}</p>}
      <div className="flex items-center justify-center gap-3">
        {segments.map((seg, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold text-ds-text tabular-nums bg-ds-accent rounded-lg w-14 sm:w-16 py-2">
              {String(seg.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-ds-muted mt-1">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
