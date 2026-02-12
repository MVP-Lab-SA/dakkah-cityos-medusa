import React from 'react'

interface AppointmentSlotsBlockProps {
  providerId?: string
  date?: string
  duration?: string
  variant?: 'list' | 'grid' | 'timeline'
}

interface SlotData {
  time: string
  available: boolean
}

const defaultSlots: SlotData[] = [
  { time: '8:00 AM', available: true },
  { time: '8:30 AM', available: false },
  { time: '9:00 AM', available: true },
  { time: '9:30 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: false },
  { time: '12:00 PM', available: true },
  { time: '12:30 PM', available: true },
  { time: '1:00 PM', available: false },
  { time: '1:30 PM', available: true },
  { time: '2:00 PM', available: true },
  { time: '2:30 PM', available: true },
  { time: '3:00 PM', available: false },
  { time: '3:30 PM', available: true },
  { time: '4:00 PM', available: true },
  { time: '4:30 PM', available: false },
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const AppointmentSlotsBlock: React.FC<AppointmentSlotsBlockProps> = ({
  providerId,
  date,
  duration = '30 min',
  variant = 'grid',
}) => {
  const today = new Date()
  const [selectedDay, setSelectedDay] = React.useState(0)
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null)

  const dateHeaders = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      return {
        day: weekDays[d.getDay() === 0 ? 6 : d.getDay() - 1],
        date: d.getDate(),
        month: d.toLocaleString('default', { month: 'short' }),
      }
    })
  }, [])

  const handleSlotClick = (time: string) => {
    setSelectedSlot(selectedSlot === time ? null : time)
  }

  const availableSlots = defaultSlots.filter((s) => s.available)

  const renderTimelineVariant = () => (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-ds-border" />
      {defaultSlots.map((slot, i) => (
        <div key={i} className="relative mb-3">
          <div className={`absolute left-[-22px] top-3 w-3 h-3 rounded-full border-2 ${
            slot.available
              ? selectedSlot === slot.time
                ? 'bg-ds-primary border-ds-primary'
                : 'bg-ds-background border-ds-primary'
              : 'bg-ds-muted border-ds-border'
          }`} />
          <button
            onClick={() => slot.available ? handleSlotClick(slot.time) : undefined}
            disabled={!slot.available}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              selectedSlot === slot.time
                ? 'border-ds-primary bg-ds-primary/10 text-ds-foreground'
                : slot.available
                  ? 'border-ds-border text-ds-foreground hover:border-ds-primary/50'
                  : 'border-ds-border bg-ds-muted text-ds-muted-foreground cursor-not-allowed'
            }`}
          >
            <span className="text-sm font-medium">{slot.time}</span>
            {slot.available && (
              <span className="text-xs text-ds-muted-foreground ml-2">({duration})</span>
            )}
            {!slot.available && (
              <span className="text-xs ml-2">Unavailable</span>
            )}
          </button>
        </div>
      ))}
    </div>
  )

  const renderListVariant = () => (
    <div className="space-y-2">
      {defaultSlots.map((slot, i) => (
        <button
          key={i}
          onClick={() => slot.available ? handleSlotClick(slot.time) : undefined}
          disabled={!slot.available}
          className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
            selectedSlot === slot.time
              ? 'border-ds-primary bg-ds-primary/10 text-ds-foreground'
              : slot.available
                ? 'border-ds-border text-ds-foreground hover:border-ds-primary/50'
                : 'border-ds-border bg-ds-muted text-ds-muted-foreground cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${slot.available ? 'bg-green-500' : 'bg-ds-muted-foreground/30'}`} />
            <span className="font-medium">{slot.time}</span>
          </div>
          <span className="text-sm text-ds-muted-foreground">{duration}</span>
        </button>
      ))}
    </div>
  )

  const renderGridVariant = () => (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {defaultSlots.map((slot, i) => (
        <button
          key={i}
          onClick={() => slot.available ? handleSlotClick(slot.time) : undefined}
          disabled={!slot.available}
          className={`p-3 rounded-lg border text-center text-sm font-medium transition-colors ${
            selectedSlot === slot.time
              ? 'border-ds-primary bg-ds-primary text-ds-primary-foreground'
              : slot.available
                ? 'border-ds-border text-ds-foreground hover:border-ds-primary hover:bg-ds-primary/5'
                : 'border-ds-border bg-ds-muted text-ds-muted-foreground/50 cursor-not-allowed line-through'
          }`}
        >
          {slot.time}
        </button>
      ))}
    </div>
  )

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-ds-card border border-ds-border rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-ds-border">
              <div className="w-12 h-12 rounded-full bg-ds-muted flex items-center justify-center">
                <svg className="w-6 h-6 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-ds-foreground">Dr. Sarah Johnson</h3>
                <p className="text-sm text-ds-muted-foreground">General Consultation · {duration}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {dateHeaders.map((d, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedDay(i); setSelectedSlot(null) }}
                  className={`flex flex-col items-center px-4 py-3 rounded-lg min-w-[64px] transition-colors ${
                    selectedDay === i
                      ? 'bg-ds-primary text-ds-primary-foreground'
                      : 'bg-ds-muted text-ds-foreground hover:bg-ds-muted/80'
                  }`}
                >
                  <span className="text-xs font-medium">{d.day}</span>
                  <span className="text-lg font-bold">{d.date}</span>
                  <span className="text-xs">{d.month}</span>
                </button>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-sm text-ds-muted-foreground mb-3">
                {availableSlots.length} slots available
              </p>
            </div>

            {variant === 'timeline' && renderTimelineVariant()}
            {variant === 'list' && renderListVariant()}
            {variant === 'grid' && renderGridVariant()}

            {selectedSlot && (
              <div className="mt-6 pt-6 border-t border-ds-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-ds-muted-foreground">Selected</p>
                    <p className="font-semibold text-ds-foreground">
                      {dateHeaders[selectedDay].day}, {dateHeaders[selectedDay].month} {dateHeaders[selectedDay].date} at {selectedSlot}
                    </p>
                  </div>
                </div>
                <button className="w-full py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Confirm Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
