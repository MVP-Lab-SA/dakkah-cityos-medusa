import { useState } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface DOBVerifierProps {
  minimumAge: number
  onVerified: (dob: string) => void
  onDenied?: () => void
  showAge?: boolean
  locale?: string
  className?: string
}

export function DOBVerifier({
  minimumAge,
  onVerified,
  onDenied,
  showAge = false,
  locale: localeProp,
  className,
}: DOBVerifierProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [day, setDay] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [error, setError] = useState("")
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null)

  const calculateAge = (dob: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age
  }

  const handleSubmit = () => {
    setError("")
    const dayNum = parseInt(day, 10)
    const monthNum = parseInt(month, 10)
    const yearNum = parseInt(year, 10)

    if (!dayNum || !monthNum || !yearNum || yearNum < 1900) {
      setError(t(locale, "ageVerification.invalid_date"))
      return
    }

    const dob = new Date(yearNum, monthNum - 1, dayNum)
    if (isNaN(dob.getTime())) {
      setError(t(locale, "ageVerification.invalid_date"))
      return
    }

    const age = calculateAge(dob)
    setCalculatedAge(age)

    if (age >= minimumAge) {
      const dobStr = `${yearNum}-${String(monthNum).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
      onVerified(dobStr)
    } else {
      setError(t(locale, "ageVerification.under_age").replace("{age}", String(minimumAge)))
      onDenied?.()
    }
  }

  return (
    <div className={clsx("bg-ds-card border border-ds-border rounded-lg p-4", className)}>
      <h4 className="text-sm font-semibold text-ds-foreground mb-3">
        {t(locale, "ageVerification.enter_dob")}
      </h4>
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <label className="block text-xs text-ds-muted-foreground mb-1">
            {t(locale, "ageVerification.day")}
          </label>
          <input
            type="number"
            min="1"
            max="31"
            placeholder="DD"
            value={day}
            onChange={(e) => { setDay(e.target.value); setError("") }}
            className="w-full px-3 py-2 text-sm rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary text-center"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-ds-muted-foreground mb-1">
            {t(locale, "ageVerification.month")}
          </label>
          <input
            type="number"
            min="1"
            max="12"
            placeholder="MM"
            value={month}
            onChange={(e) => { setMonth(e.target.value); setError("") }}
            className="w-full px-3 py-2 text-sm rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary text-center"
          />
        </div>
        <div className="flex-[1.5]">
          <label className="block text-xs text-ds-muted-foreground mb-1">
            {t(locale, "ageVerification.year")}
          </label>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            placeholder="YYYY"
            value={year}
            onChange={(e) => { setYear(e.target.value); setError("") }}
            className="w-full px-3 py-2 text-sm rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary text-center"
          />
        </div>
      </div>

      {showAge && calculatedAge !== null && !error && (
        <p className="text-xs text-ds-muted-foreground mb-2">
          {t(locale, "ageVerification.your_age")}: {calculatedAge}
        </p>
      )}

      {error && (
        <p className="text-xs text-ds-destructive mb-2">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        {t(locale, "ageVerification.verify")}
      </button>
    </div>
  )
}
