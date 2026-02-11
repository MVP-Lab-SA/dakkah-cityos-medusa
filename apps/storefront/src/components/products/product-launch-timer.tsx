import { useState, useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface ProductLaunchTimerProps {
  locale?: string
  launchDate: string | Date
  productName?: string
  onLaunch?: () => void
}

function calculateTimeLeft(target: Date) {
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

export function ProductLaunchTimer({ locale: localeProp, launchDate, productName, onLaunch }: ProductLaunchTimerProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const target = typeof launchDate === "string" ? new Date(launchDate) : launchDate
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(target))

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft(target)
      setTimeLeft(tl)
      if (tl.expired) {
        clearInterval(timer)
        onLaunch?.()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [target, onLaunch])

  if (timeLeft.expired) {
    return (
      <div className="bg-ds-success/10 border border-ds-success/20 rounded-lg p-4 text-center">
        <p className="text-sm font-medium text-ds-success">{t(locale, "productDisplay.now_available")}</p>
      </div>
    )
  }

  const units = [
    { value: timeLeft.days, label: t(locale, "productDisplay.days") },
    { value: timeLeft.hours, label: t(locale, "productDisplay.hours") },
    { value: timeLeft.minutes, label: t(locale, "productDisplay.minutes") },
    { value: timeLeft.seconds, label: t(locale, "productDisplay.seconds") },
  ]

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-5">
      {productName && (
        <p className="text-xs text-ds-muted text-center mb-1">{t(locale, "productDisplay.launching_soon")}</p>
      )}
      <h3 className="text-sm font-semibold text-ds-text text-center mb-4">
        {productName || t(locale, "productDisplay.launch_countdown")}
      </h3>

      <div className="flex justify-center gap-3">
        {units.map((unit, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 bg-ds-accent rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-ds-text tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <p className="text-xs text-ds-muted mt-1">{unit.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
