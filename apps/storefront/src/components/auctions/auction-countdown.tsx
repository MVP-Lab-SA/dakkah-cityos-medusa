import { t } from "@/lib/i18n"
import { useEffect, useState } from "react"

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

function calculateTimeLeft(endsAt: string): CountdownTime {
  const diff = new Date(endsAt).getTime() - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  }
}

interface AuctionCountdownProps {
  endsAt: string
  status: "scheduled" | "active" | "ended" | "cancelled"
  locale: string
  size?: "sm" | "md" | "lg"
  variant?: "inline" | "card" | "banner"
  onExpire?: () => void
}

export function AuctionCountdown({
  endsAt,
  status,
  locale,
  size = "md",
  variant = "inline",
  onExpire,
}: AuctionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft(endsAt))

    const interval = setInterval(() => {
      const newTime = calculateTimeLeft(endsAt)
      setTimeLeft(newTime)
      if (newTime.isExpired) {
        clearInterval(interval)
        onExpire?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endsAt, onExpire])

  if (status === "ended" || status === "cancelled") {
    return (
      <span className="text-ds-muted-foreground text-sm font-medium">
        {t(locale, "auction.auction_ended")}
      </span>
    )
  }

  if (!mounted) {
    return (
      <span className="text-ds-muted-foreground text-sm">
        {t(locale, "auction.time_remaining")}
      </span>
    )
  }

  if (timeLeft.isExpired) {
    return (
      <span className="text-ds-destructive text-sm font-medium">
        {t(locale, "auction.auction_ended")}
      </span>
    )
  }

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  const unitSizeClasses = {
    sm: "text-lg font-bold",
    md: "text-xl font-bold",
    lg: "text-2xl font-bold",
  }

  if (variant === "card") {
    return (
      <div className="flex gap-2 items-center justify-center">
        {[
          { value: timeLeft.days, label: "D" },
          { value: timeLeft.hours, label: "H" },
          { value: timeLeft.minutes, label: "M" },
          { value: timeLeft.seconds, label: "S" },
        ].map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center bg-ds-muted rounded-lg px-2 py-1 min-w-[3rem]"
          >
            <span className={`${unitSizeClasses[size]} text-ds-foreground`}>
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-ds-muted-foreground uppercase">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "banner") {
    return (
      <div className="flex items-center gap-3 bg-ds-accent/10 border border-ds-border rounded-lg px-4 py-3">
        <span className={`${sizeClasses[size]} text-ds-muted-foreground`}>
          {t(locale, "auction.time_remaining")}:
        </span>
        <div className="flex gap-1 items-center">
          {timeLeft.days > 0 && (
            <span className={`${unitSizeClasses[size]} text-ds-foreground`}>
              {timeLeft.days}d
            </span>
          )}
          <span className={`${unitSizeClasses[size]} text-ds-foreground`}>
            {String(timeLeft.hours).padStart(2, "0")}:
            {String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>
      </div>
    )
  }

  return (
    <span className={`${sizeClasses[size]} text-ds-muted-foreground font-mono`}>
      {timeLeft.days > 0 && `${timeLeft.days}d `}
      {String(timeLeft.hours).padStart(2, "0")}:
      {String(timeLeft.minutes).padStart(2, "0")}:
      {String(timeLeft.seconds).padStart(2, "0")}
    </span>
  )
}
