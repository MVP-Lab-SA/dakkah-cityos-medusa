import React from 'react'

interface CalendarEvent {
  id: string
  title: string
  start: Date | string
  end: Date | string
  color?: string
}

type CalendarView = 'month' | 'week' | 'day'

interface CalendarComponentProps {
  events?: CalendarEvent[]
  view?: CalendarView
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onViewChange?: (view: CalendarView) => void
  selectedDate?: Date
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

function toDate(d: Date | string): Date {
  return typeof d === 'string' ? new Date(d) : d
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatHour(h: number): string {
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr = h % 12 || 12
  return `${hr} ${ampm}`
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events = [],
  view: controlledView,
  onDateClick,
  onEventClick,
  onViewChange,
  selectedDate: controlledSelectedDate,
}) => {
  const [internalView, setInternalView] = React.useState<CalendarView>('month')
  const [internalDate, setInternalDate] = React.useState(new Date())

  const view = controlledView ?? internalView
  const currentDate = controlledSelectedDate ?? internalDate

  const setView = (v: CalendarView) => {
    setInternalView(v)
    onViewChange?.(v)
  }

  const navigate = (dir: number) => {
    const d = new Date(currentDate)
    if (view === 'month') d.setMonth(d.getMonth() + dir)
    else if (view === 'week') d.setDate(d.getDate() + dir * 7)
    else d.setDate(d.getDate() + dir)
    setInternalDate(d)
  }

  const goToday = () => setInternalDate(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)
  const startDay = monthStart.getDay()
  const daysInMonth = monthEnd.getDate()

  const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const getWeekDates = (): Date[] => {
    const d = new Date(currentDate)
    const day = d.getDay()
    d.setDate(d.getDate() - day)
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(d)
      dd.setDate(dd.getDate() + i)
      return dd
    })
  }

  const getEventsForDay = (date: Date): CalendarEvent[] => {
    return events.filter((e) => {
      const start = toDate(e.start)
      return isSameDay(start, date)
    })
  }

  const today = new Date()

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-ds-border">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="p-1.5 rounded-md hover:bg-ds-muted text-ds-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-lg font-semibold text-ds-foreground min-w-[200px] text-center">{monthLabel}</h2>
          <button type="button" onClick={() => navigate(1)} className="p-1.5 rounded-md hover:bg-ds-muted text-ds-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          <button type="button" onClick={goToday} className="ml-2 px-3 py-1 text-sm font-medium rounded-md border border-ds-border text-ds-foreground hover:bg-ds-muted transition-colors">
            Today
          </button>
        </div>
        <div className="flex items-center bg-ds-muted rounded-md p-0.5">
          {(['month', 'week', 'day'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3 py-1 text-sm font-medium rounded capitalize transition-colors ${view === v ? 'bg-ds-card text-ds-foreground shadow-sm' : 'text-ds-muted-foreground hover:text-ds-foreground'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === 'month' && (
        <div>
          <div className="grid grid-cols-7 border-b border-ds-border">
            {DAYS.map((d) => (
              <div key={d} className="px-2 py-2 text-center text-xs font-semibold uppercase text-ds-muted-foreground">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-ds-border bg-ds-muted/20" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = new Date(year, month, i + 1)
              const dayEvents = getEventsForDay(date)
              const isToday = isSameDay(date, today)
              const isSelected = isSameDay(date, currentDate)
              return (
                <div
                  key={i}
                  className={`min-h-[80px] border-b border-r border-ds-border p-1 cursor-pointer hover:bg-ds-muted/30 transition-colors ${isToday ? 'bg-ds-primary/5' : ''}`}
                  onClick={() => { setInternalDate(date); onDateClick?.(date) }}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full ${isToday ? 'bg-ds-primary text-ds-primary-foreground' : isSelected ? 'bg-ds-muted text-ds-foreground' : 'text-ds-foreground'}`}>
                    {i + 1}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[10px] leading-tight px-1 py-0.5 rounded truncate text-white cursor-pointer"
                        style={{ backgroundColor: ev.color || 'var(--ds-primary, #3b82f6)' }}
                        onClick={(e) => { e.stopPropagation(); onEventClick?.(ev) }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-ds-muted-foreground px-1">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === 'week' && (
        <div>
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-ds-border">
            <div className="border-r border-ds-border" />
            {getWeekDates().map((d, i) => (
              <div key={i} className="px-2 py-2 text-center border-r border-ds-border last:border-r-0">
                <div className="text-xs font-semibold uppercase text-ds-muted-foreground">{DAYS[i]}</div>
                <div className={`text-sm font-medium mt-0.5 ${isSameDay(d, today) ? 'text-ds-primary' : 'text-ds-foreground'}`}>{d.getDate()}</div>
              </div>
            ))}
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {HOURS.map((h) => (
              <div key={h} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-ds-border last:border-0">
                <div className="px-2 py-2 text-right text-xs text-ds-muted-foreground border-r border-ds-border">
                  {formatHour(h)}
                </div>
                {getWeekDates().map((d, i) => {
                  const dayEvents = getEventsForDay(d).filter((e) => {
                    const eHour = toDate(e.start).getHours()
                    return eHour === h
                  })
                  return (
                    <div
                      key={i}
                      className="min-h-[40px] border-r border-ds-border last:border-r-0 p-0.5 cursor-pointer hover:bg-ds-muted/30 transition-colors"
                      onClick={() => { const dt = new Date(d); dt.setHours(h); onDateClick?.(dt) }}
                    >
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="text-[10px] leading-tight px-1 py-0.5 rounded truncate text-white cursor-pointer"
                          style={{ backgroundColor: ev.color || 'var(--ds-primary, #3b82f6)' }}
                          onClick={(e) => { e.stopPropagation(); onEventClick?.(ev) }}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'day' && (
        <div className="max-h-[600px] overflow-y-auto">
          <div className="px-4 py-2 border-b border-ds-border bg-ds-muted/30">
            <span className="text-sm font-medium text-ds-foreground">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          {HOURS.map((h) => {
            const dayEvents = getEventsForDay(currentDate).filter((e) => toDate(e.start).getHours() === h)
            return (
              <div key={h} className="flex border-b border-ds-border last:border-0">
                <div className="w-[60px] flex-shrink-0 px-2 py-3 text-right text-xs text-ds-muted-foreground border-r border-ds-border">
                  {formatHour(h)}
                </div>
                <div
                  className="flex-1 min-h-[48px] p-1 cursor-pointer hover:bg-ds-muted/30 transition-colors"
                  onClick={() => { const dt = new Date(currentDate); dt.setHours(h); onDateClick?.(dt) }}
                >
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="text-xs px-2 py-1 rounded text-white mb-0.5 cursor-pointer"
                      style={{ backgroundColor: ev.color || 'var(--ds-primary, #3b82f6)' }}
                      onClick={(e) => { e.stopPropagation(); onEventClick?.(ev) }}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
