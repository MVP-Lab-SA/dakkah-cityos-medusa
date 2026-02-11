import { useState } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface DeliveryDate {
  id: string
  date: string
  dayLabel: string
  available: boolean
}

interface DeliveryCalendarProps {
  availableDates: DeliveryDate[]
  selectedDateId?: string
  onDateSelect: (dateId: string) => void
  month?: number
  year?: number
  onMonthChange?: (month: number, year: number) => void
  locale?: string
  className?: string
}

export function DeliveryCalendar({
  availableDates,
  selectedDateId,
  onDateSelect,
  month: monthProp,
  year: yearProp,
  onMonthChange,
  locale: localeProp,
  className,
}: DeliveryCalendarProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(monthProp ?? now.getMonth())
  const [currentYear, setCurrentYear] = useState(yearProp ?? now.getFullYear())

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

  const availableDateSet = new Map<string, DeliveryDate>()
  availableDates.forEach((d) => {
    const dateObj = new Date(d.date)
    const key = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`
    availableDateSet.set(key, d)
  })

  const handleMonthChange = (delta: number) => {
    let newMonth = currentMonth + delta
    let newYear = currentYear
    if (newMonth < 0) { newMonth = 11; newYear-- }
    if (newMonth > 11) { newMonth = 0; newYear++ }
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
    onMonthChange?.(newMonth, newYear)
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString(locale, { month: "long", year: "numeric" })

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, i)
    return d.toLocaleDateString(locale, { weekday: "short" })
  })

  return (
    <div className={clsx("bg-ds-card border border-ds-border rounded-xl p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleMonthChange(-1)}
          className="p-1.5 rounded-lg hover:bg-ds-muted transition-colors text-ds-foreground"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-ds-foreground capitalize">{monthName}</h3>
        <button
          onClick={() => handleMonthChange(1)}
          className="p-1.5 rounded-lg hover:bg-ds-muted transition-colors text-ds-foreground"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-ds-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const key = `${currentYear}-${currentMonth}-${day}`
          const deliveryDate = availableDateSet.get(key)
          const isAvailable = deliveryDate?.available ?? false
          const isSelected = deliveryDate?.id === selectedDateId

          return (
            <button
              key={day}
              onClick={() => deliveryDate && isAvailable && onDateSelect(deliveryDate.id)}
              disabled={!isAvailable}
              className={clsx(
                "aspect-square flex items-center justify-center text-sm rounded-lg transition-all",
                isSelected
                  ? "bg-ds-primary text-ds-primary-foreground font-semibold"
                  : isAvailable
                    ? "text-ds-foreground hover:bg-ds-primary/10 font-medium"
                    : "text-ds-muted-foreground/40 cursor-default"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>

      {selectedDateId && (
        <div className="mt-3 pt-3 border-t border-ds-border">
          <p className="text-xs text-ds-success font-medium">
            ✓ {t(locale, "deliverySlots.date")}: {availableDates.find((d) => d.id === selectedDateId)?.dayLabel}
          </p>
        </div>
      )}
    </div>
  )
}
