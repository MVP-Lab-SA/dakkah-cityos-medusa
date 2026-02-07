import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"

interface CalendarPickerProps {
  selectedDate: string | null
  onDateSelect: (date: string) => void
  minDate?: Date
  maxDate?: Date
  disabledDates?: string[]
}

export function CalendarPicker({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  maxDate,
  disabledDates = [],
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }, [currentMonth])

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const isDateDisabled = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]

    // Check if before min date
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) {
      return true
    }

    // Check if after max date
    if (maxDate && date > maxDate) {
      return true
    }

    // Check if in disabled dates
    if (disabledDates.includes(dateString)) {
      return true
    }

    // Disable weekends (optional - remove if you want weekends available)
    // if (date.getDay() === 0 || date.getDay() === 6) {
    //   return true
    // }

    return false
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toISOString().split("T")[0] === selectedDate
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const canGoPrevious = () => {
    const previousMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    )
    const today = new Date()
    return previousMonth >= new Date(today.getFullYear(), today.getMonth(), 1)
  }

  return (
    <div className="select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious()}
          className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h3 className="text-lg font-semibold text-slate-900">{monthLabel}</h3>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-slate-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const disabled = isDateDisabled(date)
          const selected = isDateSelected(date)
          const today = isToday(date)

          return (
            <button
              key={date.toISOString()}
              onClick={() => {
                if (!disabled) {
                  onDateSelect(date.toISOString().split("T")[0])
                }
              }}
              disabled={disabled}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  selected
                    ? "bg-slate-900 text-white"
                    : disabled
                      ? "text-slate-300 cursor-not-allowed"
                      : today
                        ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                        : "text-slate-700 hover:bg-slate-100"
                }
              `}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface TimeSlotPickerProps {
  slots: {
    start: string
    end: string
    available: boolean
    capacity_remaining?: number
  }[]
  selectedSlot: string | null
  onSlotSelect: (slot: string) => void
  isLoading?: boolean
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSlotSelect,
  isLoading,
}: TimeSlotPickerProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-lg bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    )
  }

  const availableSlots = slots.filter((slot) => slot.available)

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No available times for this date.</p>
        <p className="text-sm text-slate-400 mt-1">
          Please select a different date.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {availableSlots.map((slot) => {
        const isSelected = selectedSlot === slot.start

        return (
          <button
            key={slot.start}
            onClick={() => onSlotSelect(slot.start)}
            className={`
              py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isSelected
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }
            `}
          >
            {formatTime(slot.start)}
          </button>
        )
      })}
    </div>
  )
}
