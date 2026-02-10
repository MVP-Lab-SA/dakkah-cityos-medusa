import { t } from "@/lib/i18n"
import { useState, useEffect } from "react"

interface EventCountdownProps {
  date: string
  locale: string
  size?: "sm" | "md" | "lg"
  onComplete?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const sizeClasses = {
  sm: { box: "w-12 h-12", number: "text-base", label: "text-[9px]" },
  md: { box: "w-16 h-16", number: "text-xl", label: "text-[10px]" },
  lg: { box: "w-20 h-20", number: "text-2xl", label: "text-xs" },
}

export function EventCountdown({ date, locale, size = "md", onComplete }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calcTimeLeft(date))

    const interval = setInterval(() => {
      const next = calcTimeLeft(date)
      setTimeLeft(next)

      if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
        clearInterval(interval)
        onComplete?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [date, onComplete])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`${sizeClasses[size].box} bg-ds-muted rounded-lg animate-pulse`}
          />
        ))}
      </div>
    )
  }

  const segments: { value: number; label: string }[] = [
    { value: timeLeft.days, label: locale === "ar" ? "يوم" : locale === "fr" ? "Jours" : "Days" },
    { value: timeLeft.hours, label: locale === "ar" ? "ساعة" : locale === "fr" ? "Heures" : "Hours" },
    { value: timeLeft.minutes, label: locale === "ar" ? "دقيقة" : locale === "fr" ? "Min" : "Min" },
    { value: timeLeft.seconds, label: locale === "ar" ? "ثانية" : locale === "fr" ? "Sec" : "Sec" },
  ]

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  if (isExpired) {
    return (
      <div className="text-center py-3">
        <span className="text-sm font-medium text-ds-muted-foreground">
          {t(locale, "events.past_events")}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 justify-center">
      {segments.map((seg, i) => (
        <div key={i} className="flex flex-col items-center">
          <div
            className={`${sizeClasses[size].box} flex items-center justify-center bg-ds-muted rounded-lg border border-ds-border`}
          >
            <span className={`${sizeClasses[size].number} font-bold text-ds-foreground tabular-nums`}>
              {String(seg.value).padStart(2, "0")}
            </span>
          </div>
          <span className={`${sizeClasses[size].label} font-medium text-ds-muted-foreground mt-1 uppercase`}>
            {seg.label}
          </span>
        </div>
      ))}
    </div>
  )
}
