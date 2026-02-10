import { useState, useEffect } from "react"

interface CountdownTimerProps {
  endsAt: string
  variant?: "default" | "compact" | "segmented"
  showLabels?: boolean
  onComplete?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(endsAt: string): TimeLeft {
  const diff = Math.max(0, new Date(endsAt).getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function CountdownTimer({ endsAt, variant = "default", showLabels = true, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calcTimeLeft(endsAt))

    const timer = setInterval(() => {
      const tl = calcTimeLeft(endsAt)
      setTimeLeft(tl)
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        clearInterval(timer)
        onComplete?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endsAt, onComplete])

  if (!mounted) {
    return <div className="h-8 bg-ds-muted rounded animate-pulse" />
  }

  const pad = (n: number) => n.toString().padStart(2, "0")

  if (variant === "compact") {
    return (
      <span className="text-sm font-mono font-medium text-ds-foreground">
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    )
  }

  if (variant === "segmented") {
    const segments = [
      { value: timeLeft.days, label: "Days" },
      { value: timeLeft.hours, label: "Hrs" },
      { value: timeLeft.minutes, label: "Min" },
      { value: timeLeft.seconds, label: "Sec" },
    ]

    return (
      <div className="flex items-center gap-2">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="bg-ds-muted px-3 py-2 rounded-lg min-w-[3rem] text-center">
                <span className="text-xl font-bold font-mono text-ds-foreground">{pad(seg.value)}</span>
              </div>
              {showLabels && (
                <span className="text-xs text-ds-muted-foreground mt-1">{seg.label}</span>
              )}
            </div>
            {i < segments.length - 1 && (
              <span className="text-xl font-bold text-ds-muted-foreground mb-5">:</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  const parts = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ]

  return (
    <div className="flex items-center gap-3">
      {parts.map((part) => (
        <div key={part.label} className="text-center">
          <div className="text-2xl font-bold font-mono text-ds-foreground">{pad(part.value)}</div>
          {showLabels && <div className="text-xs text-ds-muted-foreground">{part.label}</div>}
        </div>
      ))}
    </div>
  )
}
