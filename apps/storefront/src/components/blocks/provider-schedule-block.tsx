import React from 'react'

interface ProviderScheduleBlockProps {
  providerId?: string
  view?: 'week' | 'day' | 'month'
  showAvailability?: boolean
}

const hours = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8
  return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
})

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const scheduleData: Record<string, Record<string, 'available' | 'booked' | 'break'>> = {
  Mon: { '8:00 AM': 'available', '9:00 AM': 'available', '10:00 AM': 'booked', '11:00 AM': 'booked', '12:00 PM': 'break', '1:00 PM': 'available', '2:00 PM': 'available', '3:00 PM': 'booked', '4:00 PM': 'available', '5:00 PM': 'available', '6:00 PM': 'available', '7:00 PM': 'available' },
  Tue: { '8:00 AM': 'available', '9:00 AM': 'booked', '10:00 AM': 'available', '11:00 AM': 'available', '12:00 PM': 'break', '1:00 PM': 'booked', '2:00 PM': 'booked', '3:00 PM': 'available', '4:00 PM': 'available', '5:00 PM': 'booked', '6:00 PM': 'available', '7:00 PM': 'available' },
  Wed: { '8:00 AM': 'booked', '9:00 AM': 'booked', '10:00 AM': 'booked', '11:00 AM': 'available', '12:00 PM': 'break', '1:00 PM': 'available', '2:00 PM': 'available', '3:00 PM': 'available', '4:00 PM': 'booked', '5:00 PM': 'available', '6:00 PM': 'available', '7:00 PM': 'available' },
  Thu: { '8:00 AM': 'available', '9:00 AM': 'available', '10:00 AM': 'available', '11:00 AM': 'booked', '12:00 PM': 'break', '1:00 PM': 'booked', '2:00 PM': 'available', '3:00 PM': 'available', '4:00 PM': 'available', '5:00 PM': 'available', '6:00 PM': 'booked', '7:00 PM': 'available' },
  Fri: { '8:00 AM': 'available', '9:00 AM': 'booked', '10:00 AM': 'available', '11:00 AM': 'available', '12:00 PM': 'break', '1:00 PM': 'available', '2:00 PM': 'booked', '3:00 PM': 'booked', '4:00 PM': 'available', '5:00 PM': 'available', '6:00 PM': 'available', '7:00 PM': 'available' },
  Sat: { '8:00 AM': 'available', '9:00 AM': 'available', '10:00 AM': 'available', '11:00 AM': 'available', '12:00 PM': 'break', '1:00 PM': 'available', '2:00 PM': 'available', '3:00 PM': 'available', '4:00 PM': 'available', '5:00 PM': 'available', '6:00 PM': 'available', '7:00 PM': 'available' },
  Sun: { '8:00 AM': 'break', '9:00 AM': 'break', '10:00 AM': 'break', '11:00 AM': 'break', '12:00 PM': 'break', '1:00 PM': 'break', '2:00 PM': 'break', '3:00 PM': 'break', '4:00 PM': 'break', '5:00 PM': 'break', '6:00 PM': 'break', '7:00 PM': 'break' },
}

export const ProviderScheduleBlock: React.FC<ProviderScheduleBlockProps> = ({
  providerId,
  view: initialView = 'week',
  showAvailability = true,
}) => {
  const [currentView, setCurrentView] = React.useState(initialView)

  const getStatusColor = (status: 'available' | 'booked' | 'break') => {
    switch (status) {
      case 'available': return 'bg-ds-success/15 border-ds-success/40 text-ds-success'
      case 'booked': return 'bg-ds-muted border-ds-border text-ds-muted-foreground'
      case 'break': return 'bg-ds-background border-ds-border text-ds-muted-foreground/50'
    }
  }

  const renderDayView = () => {
    const dayData = scheduleData['Mon']
    return (
      <div className="space-y-2">
        {hours.map((hour) => {
          const status = dayData[hour] || 'available'
          return (
            <div key={hour} className="flex items-center gap-4">
              <span className="w-20 text-sm text-ds-muted-foreground text-right flex-shrink-0">{hour}</span>
              <div className={`flex-1 p-3 rounded-lg border ${getStatusColor(status)}`}>
                <span className="text-sm font-medium capitalize">{status}</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="p-2" />
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-ds-foreground">
              {day}
            </div>
          ))}
        </div>

        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
            <div className="p-2 text-xs text-ds-muted-foreground text-right flex items-center justify-end">
              {hour}
            </div>
            {weekDays.map((day) => {
              const status = scheduleData[day]?.[hour] || 'available'
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`p-2 rounded border text-xs text-center ${getStatusColor(status)}`}
                >
                  {status === 'booked' ? 'Booked' : status === 'break' ? '—' : ''}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )

  const renderMonthView = () => {
    const today = new Date()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
    const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' })

    return (
      <div>
        <h3 className="text-lg font-semibold text-ds-foreground text-center mb-4">{monthName}</h3>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="p-2 text-center text-xs font-medium text-ds-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1
            const dayOfWeek = new Date(today.getFullYear(), today.getMonth(), dayNum).getDay()
            const isSunday = dayOfWeek === 0
            return (
              <div
                key={dayNum}
                className={`p-2 text-center rounded text-sm ${
                  isSunday ? 'bg-ds-muted text-ds-muted-foreground' : 'bg-ds-success/10 text-ds-foreground'
                }`}
              >
                {dayNum}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-ds-card border border-ds-border rounded-xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-ds-muted flex items-center justify-center">
                <svg className="w-7 h-7 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-ds-foreground">Dr. Sarah Johnson</h2>
                <p className="text-sm text-ds-muted-foreground">General Practitioner</p>
              </div>
            </div>

            <div className="flex bg-ds-muted rounded-lg p-1">
              {(['day', 'week', 'month'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setCurrentView(v)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                    currentView === v
                      ? 'bg-ds-background text-ds-foreground shadow-sm'
                      : 'text-ds-muted-foreground hover:text-ds-foreground'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {showAvailability && (
            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-ds-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-ds-success/15 border border-ds-success/40" />
                <span className="text-xs text-ds-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-ds-muted border border-ds-border" />
                <span className="text-xs text-ds-muted-foreground">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-ds-background border border-ds-border" />
                <span className="text-xs text-ds-muted-foreground">Unavailable</span>
              </div>
            </div>
          )}

          {currentView === 'day' && renderDayView()}
          {currentView === 'week' && renderWeekView()}
          {currentView === 'month' && renderMonthView()}
        </div>
      </div>
    </section>
  )
}
