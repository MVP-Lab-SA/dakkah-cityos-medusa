import { t } from "@/lib/i18n"
import { useState, useEffect, useCallback, useMemo } from "react"

interface RentalCalendarProps {
  locale: string
  availableDates?: string[]
  bookedDates?: string[]
  selectedRange?: { start: string; end: string } | null
  onRangeSelect?: (range: { start: string; end: string } | null) => void
  minDays?: number
  maxDays?: number
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function isDateInRange(dateKey: string, start: string, end: string): boolean {
  return dateKey >= start && dateKey <= end
}

export function RentalCalendar({
  locale,
  availableDates = [],
  bookedDates = [],
  selectedRange,
  onRangeSelect,
  minDays = 1,
}: RentalCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(0)
  const [currentYear, setCurrentYear] = useState(2026)
  const [selectingStart, setSelectingStart] = useState(true)
  const [tempStart, setTempStart] = useState<string | null>(null)

  useEffect(() => {
    const now = new Date()
    setCurrentMonth(now.getMonth())
    setCurrentYear(now.getFullYear())
  }, [])

  const bookedSet = useMemo(() => new Set(bookedDates), [bookedDates])
  const availableSet = useMemo(
    () => (availableDates.length > 0 ? new Set(availableDates) : null),
    [availableDates]
  )

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const today = useMemo(() => {
    const d = new Date()
    return formatDateKey(d.getFullYear(), d.getMonth(), d.getDate())
  }, [])

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return prev - 1
    })
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return prev + 1
    })
  }, [])

  const handleDayClick = useCallback(
    (dateKey: string) => {
      if (bookedSet.has(dateKey)) return
      if (availableSet && !availableSet.has(dateKey)) return
      if (dateKey < today) return

      if (selectingStart) {
        setTempStart(dateKey)
        setSelectingStart(false)
      } else if (tempStart) {
        const start = dateKey < tempStart ? dateKey : tempStart
        const end = dateKey < tempStart ? tempStart : dateKey
        const diffMs = new Date(end).getTime() - new Date(start).getTime()
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1
        if (diffDays >= minDays) {
          onRangeSelect?.({ start, end })
        }
        setTempStart(null)
        setSelectingStart(true)
      }
    },
    [selectingStart, tempStart, bookedSet, availableSet, today, minDays, onRangeSelect]
  )

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : "en-US",
    { month: "long", year: "numeric" }
  )

  return (
    <div className="bg-ds-background border border-ds-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-ds-muted transition-colors text-ds-foreground"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-ds-foreground">{monthName}</h3>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-ds-muted transition-colors text-ds-foreground"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-ds-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateKey = formatDateKey(currentYear, currentMonth, day)
          const isBooked = bookedSet.has(dateKey)
          const isPast = dateKey < today
          const isUnavailable = availableSet ? !availableSet.has(dateKey) : false
          const isDisabled = isBooked || isPast || isUnavailable
          const isSelected =
            selectedRange &&
            isDateInRange(dateKey, selectedRange.start, selectedRange.end)
          const isRangeStart = selectedRange?.start === dateKey
          const isRangeEnd = selectedRange?.end === dateKey
          const isTempStart = tempStart === dateKey

          let dayClass =
            "aspect-square flex items-center justify-center text-sm rounded-lg transition-colors "

          if (isBooked) {
            dayClass += "bg-ds-destructive/20 text-ds-destructive cursor-not-allowed line-through"
          } else if (isDisabled) {
            dayClass += "text-ds-muted-foreground/40 cursor-not-allowed"
          } else if (isRangeStart || isRangeEnd || isTempStart) {
            dayClass += "bg-ds-primary text-ds-primary-foreground font-semibold cursor-pointer"
          } else if (isSelected) {
            dayClass += "bg-ds-primary/20 text-ds-primary cursor-pointer"
          } else {
            dayClass += "text-ds-foreground hover:bg-ds-muted cursor-pointer"
          }

          return (
            <button
              key={dateKey}
              onClick={() => !isDisabled && handleDayClick(dateKey)}
              disabled={isDisabled}
              className={dayClass}
              aria-label={dateKey}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-ds-border text-xs text-ds-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-ds-primary" />
          <span>{t(locale, "rental.select_dates")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-ds-destructive/20" />
          <span>{t(locale, "blocks.active")}</span>
        </div>
      </div>
    </div>
  )
}
