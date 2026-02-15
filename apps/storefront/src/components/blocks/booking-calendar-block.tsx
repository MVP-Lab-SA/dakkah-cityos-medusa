import React from 'react'

interface TimeSlot {
  time: string
  available: boolean
  price?: number
}

interface BookingCalendarBlockProps {
  serviceId?: string
  variant?: 'monthly' | 'weekly' | 'daily'
  showPricing?: boolean
  allowMultiDay?: boolean
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const defaultTimeSlots: TimeSlot[] = [
  { time: '9:00 AM', available: true, price: 50 },
  { time: '10:00 AM', available: true, price: 50 },
  { time: '11:00 AM', available: false, price: 50 },
  { time: '12:00 PM', available: true, price: 60 },
  { time: '1:00 PM', available: true, price: 60 },
  { time: '2:00 PM', available: false, price: 50 },
  { time: '3:00 PM', available: true, price: 50 },
  { time: '4:00 PM', available: true, price: 50 },
  { time: '5:00 PM', available: false, price: 70 },
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const BookingCalendarBlock: React.FC<BookingCalendarBlockProps> = ({
  serviceId,
  variant = 'monthly',
  showPricing = true,
  allowMultiDay = false,
}) => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth())
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = React.useState<number | null>(today.getDate())
  const [selectedEndDate, setSelectedEndDate] = React.useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const unavailableDays = new Set([5, 12, 19, 25])

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDate(null)
    setSelectedEndDate(null)
    setSelectedSlot(null)
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDate(null)
    setSelectedEndDate(null)
    setSelectedSlot(null)
  }

  const handleDateClick = (day: number) => {
    if (unavailableDays.has(day)) return
    if (allowMultiDay && selectedDate && !selectedEndDate && day > selectedDate) {
      setSelectedEndDate(day)
    } else {
      setSelectedDate(day)
      setSelectedEndDate(null)
    }
    setSelectedSlot(null)
  }

  const isInRange = (day: number) => {
    if (!allowMultiDay || !selectedDate || !selectedEndDate) return false
    return day >= selectedDate && day <= selectedEndDate
  }

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-ds-card border border-ds-border rounded-xl p-6 animate-pulse">
              <div className="h-8 bg-ds-muted rounded w-48 mb-6" />
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-10 bg-ds-muted rounded" />
                ))}
              </div>
            </div>
            <div className="bg-ds-card border border-ds-border rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-ds-muted rounded w-32 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-ds-muted rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-ds-card border border-ds-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-ds-muted transition-colors text-ds-foreground"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-ds-foreground">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-ds-muted transition-colors text-ds-foreground"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-ds-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const isUnavailable = unavailableDays.has(day)
                const isSelected = day === selectedDate || day === selectedEndDate
                const inRange = isInRange(day)
                const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    disabled={isUnavailable}
                    className={`h-10 rounded-lg text-sm font-medium transition-colors relative ${
                      isSelected
                        ? 'bg-ds-primary text-ds-primary-foreground'
                        : inRange
                          ? 'bg-ds-primary/20 text-ds-foreground'
                          : isUnavailable
                            ? 'text-ds-muted-foreground/40 cursor-not-allowed line-through'
                            : isToday
                              ? 'bg-ds-muted text-ds-foreground font-bold'
                              : 'text-ds-foreground hover:bg-ds-muted'
                    }`}
                  >
                    {day}
                    {!isUnavailable && !isSelected && (
                      <span className="absolute bottom-1 start-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ds-success" />
                    )}
                  </button>
                )
              })}
            </div>

            {allowMultiDay && (
              <p className="text-xs text-ds-muted-foreground mt-4">
                Select a start date, then click an end date for multi-day booking.
              </p>
            )}
          </div>

          <div className="bg-ds-card border border-ds-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-ds-foreground mb-4">
              {selectedDate
                ? `${monthNames[currentMonth]} ${selectedDate}${selectedEndDate ? ` - ${selectedEndDate}` : ''}`
                : 'Select a date'}
            </h3>

            {selectedDate && (
              <div className="space-y-2">
                {defaultTimeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available ? setSelectedSlot(slot.time) : undefined}
                    disabled={!slot.available}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-colors ${
                      selectedSlot === slot.time
                        ? 'border-ds-primary bg-ds-primary/10 text-ds-foreground'
                        : slot.available
                          ? 'border-ds-border text-ds-foreground hover:border-ds-primary/50'
                          : 'border-ds-border bg-ds-muted text-ds-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <span>{slot.time}</span>
                    <span className="flex items-center gap-2">
                      {showPricing && slot.price && (
                        <span className="font-semibold">${slot.price}</span>
                      )}
                      {slot.available ? (
                        <span className="w-2 h-2 rounded-full bg-ds-success" />
                      ) : (
                        <span className="text-xs">Booked</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {selectedDate && selectedSlot && (
              <button className="w-full mt-6 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
