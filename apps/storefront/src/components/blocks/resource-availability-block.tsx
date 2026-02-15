import React from 'react'

interface AvailabilityWindow {
  start: string
  end: string
  status: 'available' | 'booked' | 'maintenance'
  label?: string
}

interface ResourceAvailabilityBlockProps {
  resourceType?: string
  resourceId?: string
  dateRange?: string
  variant?: 'calendar' | 'list' | 'timeline'
}

const defaultWindows: AvailabilityWindow[] = [
  { start: '8:00 AM', end: '10:00 AM', status: 'available' },
  { start: '10:00 AM', end: '11:30 AM', status: 'booked', label: 'Team Meeting' },
  { start: '11:30 AM', end: '12:00 PM', status: 'available' },
  { start: '12:00 PM', end: '1:00 PM', status: 'maintenance', label: 'Cleaning' },
  { start: '1:00 PM', end: '3:00 PM', status: 'available' },
  { start: '3:00 PM', end: '4:30 PM', status: 'booked', label: 'Workshop' },
  { start: '4:30 PM', end: '6:00 PM', status: 'available' },
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const statusColors: Record<string, string> = {
  available: 'bg-ds-success/15 border-ds-success/40 text-ds-success',
  booked: 'bg-ds-destructive/10 border-ds-destructive/30 text-ds-destructive',
  maintenance: 'bg-ds-warning/10 border-ds-warning/30 text-ds-warning',
}

const statusDot: Record<string, string> = {
  available: 'bg-ds-success',
  booked: 'bg-ds-destructive/80',
  maintenance: 'bg-ds-warning',
}

export const ResourceAvailabilityBlock: React.FC<ResourceAvailabilityBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  resourceType = 'Meeting Room',
  resourceId,
  dateRange,
  variant = 'calendar',
}) => {
  const [selectedWindow, setSelectedWindow] = React.useState<number | null>(null)

  const renderCalendarVariant = () => {
    const today = new Date()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
    const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' })

    const busyDays = new Set([3, 7, 10, 14, 17, 21, 24, 28])
    const maintenanceDays = new Set([8, 22])

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
            const day = i + 1
            const isBusy = busyDays.has(day)
            const isMaintenance = maintenanceDays.has(day)
            return (
              <button
                key={day}
                className={`p-2 text-center rounded text-sm transition-colors ${
                  isMaintenance
                    ? 'bg-ds-warning/10 text-ds-warning border border-ds-warning/30'
                    : isBusy
                      ? 'bg-ds-destructive/10 text-ds-destructive border border-ds-destructive/30'
                      : 'bg-ds-success/10 text-ds-foreground border border-ds-success/30 hover:bg-ds-success/15'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderListVariant = () => (
    <div className="space-y-2">
      {defaultWindows.map((window, i) => (
        <button
          key={i}
          onClick={() => window.status === 'available' ? setSelectedWindow(selectedWindow === i ? null : i) : undefined}
          disabled={window.status !== 'available'}
          className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
            selectedWindow === i
              ? 'border-ds-primary bg-ds-primary/10'
              : statusColors[window.status]
          } ${window.status !== 'available' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot[window.status]}`} />
            <div className="text-left">
              <p className="text-sm font-medium">{window.start} – {window.end}</p>
              {window.label && <p className="text-xs opacity-70">{window.label}</p>}
            </div>
          </div>
          <span className="text-xs font-medium capitalize">{window.status}</span>
        </button>
      ))}
    </div>
  )

  const renderTimelineVariant = () => (
    <div className="relative">
      <div className="flex gap-1">
        {defaultWindows.map((window, i) => {
          const startHour = parseInt(window.start)
          const endHour = parseInt(window.end)
          const duration = Math.max(endHour - startHour, 1)
          return (
            <div
              key={i}
              className={`rounded-lg border p-3 text-center transition-colors ${statusColors[window.status]} ${
                window.status === 'available' ? 'cursor-pointer hover:opacity-80' : ''
              }`}
              style={{ flex: duration }}
              onClick={() => window.status === 'available' ? setSelectedWindow(selectedWindow === i ? null : i) : undefined}
            >
              <p className="text-xs font-medium">{window.start}</p>
              <p className="text-xs">{window.end}</p>
              {window.label && <p className="text-[10px] mt-1 opacity-70">{window.label}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-ds-card border border-ds-border rounded-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-ds-border">
              <div>
                <p className="text-xs text-ds-muted-foreground uppercase tracking-wider mb-1">{resourceType}</p>
                <h2 className="text-xl font-bold text-ds-foreground">Conference Room A</h2>
                <p className="text-sm text-ds-muted-foreground">Capacity: 12 people · Floor 3</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-ds-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-ds-success" />
                <span className="text-xs text-ds-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-ds-destructive/80" />
                <span className="text-xs text-ds-muted-foreground">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-ds-warning" />
                <span className="text-xs text-ds-muted-foreground">Maintenance</span>
              </div>
            </div>

            {variant === 'calendar' && renderCalendarVariant()}
            {variant === 'list' && renderListVariant()}
            {variant === 'timeline' && renderTimelineVariant()}

            {selectedWindow !== null && (
              <div className="mt-6 pt-6 border-t border-ds-border flex items-center justify-between">
                <div>
                  <p className="text-sm text-ds-muted-foreground">Selected</p>
                  <p className="font-semibold text-ds-foreground">
                    {defaultWindows[selectedWindow].start} – {defaultWindows[selectedWindow].end}
                  </p>
                </div>
                <button className="px-6 py-2.5 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Reserve
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
