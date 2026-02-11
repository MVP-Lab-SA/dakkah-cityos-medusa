import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface EscrowEvent {
  id: string
  status: string
  timestamp: string
  description: string
  actor?: string
}

interface EscrowTimelineProps {
  events: EscrowEvent[]
  currentStatus: "held" | "released" | "disputed" | "refunded"
  locale?: string
  loading?: boolean
}

const eventColors: Record<string, string> = {
  held: "bg-ds-warning text-white",
  released: "bg-ds-success text-white",
  disputed: "bg-ds-destructive text-white",
  refunded: "bg-ds-accent text-white",
  created: "bg-ds-primary text-ds-primary-foreground",
}

export function EscrowTimeline({
  events,
  currentStatus,
  locale: localeProp,
  loading = false,
}: EscrowTimelineProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-ds-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-ds-muted rounded" />
              <div className="h-3 w-48 bg-ds-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!events.length) {
    return (
      <div className="bg-ds-background rounded-lg border border-ds-border p-8 text-center">
        <p className="text-ds-muted-foreground">{t(locale, "escrow.no_events")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-ds-foreground">{t(locale, "escrow.timeline")}</h4>
      <div className="relative">
        {events.map((event, index) => {
          const isLast = index === events.length - 1
          const dotColor = eventColors[event.status] || "bg-ds-muted-foreground text-white"

          return (
            <div key={event.id} className="flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0", dotColor)}>
                  {index + 1}
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-ds-border mt-1" />}
              </div>
              <div className="flex-1 min-w-0 pb-2">
                <p className="text-sm font-medium text-ds-foreground">{event.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-ds-muted-foreground">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                  {event.actor && (
                    <>
                      <span className="text-xs text-ds-muted-foreground">·</span>
                      <span className="text-xs text-ds-muted-foreground">{event.actor}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
