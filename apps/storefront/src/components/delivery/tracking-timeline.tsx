import { t, formatDate, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

interface TrackingEvent {
  id: string
  status: string
  description: string
  timestamp: string
  location?: string
}

interface TrackingTimelineProps {
  events: TrackingEvent[]
  currentStatus: string
  estimatedDelivery?: string
  locale: string
  className?: string
}

const statusI18nMap: Record<string, string> = {
  preparing: "delivery.preparing",
  "picked-up": "delivery.picked_up",
  "in-transit": "delivery.in_transit",
  nearby: "delivery.nearby",
  delivered: "delivery.delivered",
}

export function TrackingTimeline({
  events,
  currentStatus,
  estimatedDelivery,
  locale,
  className,
}: TrackingTimelineProps) {
  const getEventState = (event: TrackingEvent, index: number) => {
    const currentIndex = events.findIndex((e) => e.status === currentStatus)
    if (index < currentIndex) return "completed"
    if (index === currentIndex) return "current"
    return "upcoming"
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: formatDate(date, locale as SupportedLocale),
      time: date.toLocaleTimeString(
        locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : "en-US",
        { hour: "2-digit", minute: "2-digit" }
      ),
    }
  }

  if (!events.length) {
    return (
      <div className={clsx("bg-ds-muted rounded-lg p-8 text-center", className)}>
        <p className="text-ds-muted-foreground">{t(locale, "delivery.no_tracking")}</p>
      </div>
    )
  }

  return (
    <div className={clsx("bg-ds-background rounded-xl border border-ds-border overflow-hidden", className)}>
      {estimatedDelivery && (
        <div className="px-6 py-4 bg-ds-info/10 border-b border-ds-border">
          <p className="text-sm text-ds-foreground">
            <span className="font-semibold">{t(locale, "delivery.estimated_delivery")}:</span>{" "}
            {estimatedDelivery}
          </p>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-lg font-semibold text-ds-foreground mb-6">
          {t(locale, "delivery.tracking_timeline")}
        </h3>

        <div className="relative">
          {events.map((event, index) => {
            const state = getEventState(event, index)
            const { date, time } = formatTimestamp(event.timestamp)
            const isLast = index === events.length - 1
            const statusLabel =
              statusI18nMap[event.status]
                ? t(locale, statusI18nMap[event.status])
                : event.status

            return (
              <div key={event.id} className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      "w-4 h-4 rounded-full border-2 flex-shrink-0 z-10",
                      state === "completed" && "bg-ds-success border-ds-success",
                      state === "current" && "bg-ds-info border-ds-info animate-pulse",
                      state === "upcoming" && "bg-ds-muted border-ds-border"
                    )}
                  />
                  {!isLast && (
                    <div
                      className={clsx(
                        "w-0.5 flex-1 min-h-[2rem]",
                        state === "completed" || state === "current"
                          ? "bg-ds-success"
                          : "bg-ds-border"
                      )}
                    />
                  )}
                </div>

                <div className={clsx("pb-6 flex-1", isLast && "pb-0")}>
                  <p
                    className={clsx(
                      "font-medium",
                      state === "upcoming" ? "text-ds-muted-foreground" : "text-ds-foreground"
                    )}
                  >
                    {statusLabel}
                  </p>
                  <p className="text-sm text-ds-muted-foreground mt-0.5">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-ds-muted-foreground">
                      {date} · {time}
                    </span>
                    {event.location && (
                      <span className="text-xs text-ds-muted-foreground">
                        · {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
