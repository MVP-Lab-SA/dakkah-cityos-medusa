import { useState, useEffect } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface FlashSaleCountdownProps {
  locale?: string
  endDate: string | Date
  onExpired?: () => void
  compact?: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(endDate: Date): TimeLeft {
  const diff = endDate.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function FlashSaleCountdown({ locale: localeProp, endDate, onExpired, compact = false }: FlashSaleCountdownProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const end = typeof endDate === "string" ? new Date(endDate) : endDate
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(end))
    const timer = setInterval(() => {
      const tl = calculateTimeLeft(end)
      setTimeLeft(tl)
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        clearInterval(timer)
        onExpired?.()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  const pad = (n: number) => String(n).padStart(2, "0")

  const units = [
    { value: timeLeft.days, label: t(locale, "flashSale.days") },
    { value: timeLeft.hours, label: t(locale, "flashSale.hours") },
    { value: timeLeft.minutes, label: t(locale, "flashSale.minutes") },
    { value: timeLeft.seconds, label: t(locale, "flashSale.seconds") },
  ]

  if (compact) {
    return (
      <div className="flex items-center gap-1 font-mono text-sm font-bold">
        <span className="bg-ds-foreground text-ds-background px-1.5 py-0.5 rounded">{pad(timeLeft.hours + timeLeft.days * 24)}</span>
        <span className="text-ds-foreground">:</span>
        <span className="bg-ds-foreground text-ds-background px-1.5 py-0.5 rounded">{pad(timeLeft.minutes)}</span>
        <span className="text-ds-foreground">:</span>
        <span className="bg-ds-foreground text-ds-background px-1.5 py-0.5 rounded">{pad(timeLeft.seconds)}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {units.map((unit, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="bg-ds-foreground text-ds-background rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-[3rem] text-center">
            <span className="text-lg sm:text-2xl font-bold font-mono">{pad(unit.value)}</span>
          </div>
          <span className="text-xs text-ds-muted-foreground mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}
