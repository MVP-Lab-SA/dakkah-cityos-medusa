import { t } from "@/lib/i18n"
import { formatCurrency } from "@/lib/i18n"
import { Link } from "@tanstack/react-router"

export interface EventCardData {
  id: string
  title: string
  thumbnail?: string
  date: string
  endDate?: string
  venue?: { name: string; address?: string }
  category?: string
  price?: { amount: number; currencyCode: string }
  isFree?: boolean
  availableTickets?: number
  totalTickets?: number
  status: "upcoming" | "ongoing" | "ended" | "cancelled" | "sold-out"
}

const statusStyles: Record<string, string> = {
  upcoming: "bg-ds-primary/20 text-ds-primary",
  ongoing: "bg-ds-success/20 text-ds-success",
  ended: "bg-ds-muted text-ds-muted-foreground",
  cancelled: "bg-ds-destructive/20 text-ds-destructive",
  "sold-out": "bg-ds-warning/20 text-ds-warning",
}

export function EventCard({
  event,
  locale,
  prefix,
}: {
  event: EventCardData
  locale: string
  prefix: string
}) {
  const eventDate = new Date(event.date)
  const month = eventDate.toLocaleDateString(locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : "en-US", { month: "short" })
  const day = eventDate.getDate()

  const ticketPercent = event.totalTickets && event.availableTickets != null
    ? ((event.totalTickets - event.availableTickets) / event.totalTickets) * 100
    : null

  return (
    <div className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:border-ds-ring transition-colors">
      <Link to={`${prefix}/events/${event.id}` as any} className="block">
        <div className="relative aspect-[4/3] bg-ds-muted overflow-hidden">
          {event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-ds-muted-foreground/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          <div className="absolute top-3 start-3 flex flex-col items-center bg-ds-background/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm">
            <span className="text-[10px] font-semibold text-ds-primary uppercase leading-tight">
              {month}
            </span>
            <span className="text-lg font-bold text-ds-foreground leading-tight">
              {day}
            </span>
          </div>

          <div className="absolute top-3 end-3 flex flex-col gap-1 items-end">
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                statusStyles[event.status] || statusStyles.upcoming
              }`}
            >
              {event.status === "sold-out"
                ? t(locale, "events.sold_out")
                : event.status}
            </span>
          </div>

          {event.category && (
            <div className="absolute bottom-3 start-3">
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-ds-background/80 text-ds-foreground backdrop-blur-sm">
                {event.category}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link to={`${prefix}/events/${event.id}` as any} className="block">
          <h3 className="font-semibold text-ds-foreground line-clamp-2 group-hover:text-ds-primary transition-colors">
            {event.title}
          </h3>
        </Link>

        {event.venue && (
          <div className="flex items-center gap-1.5 text-sm text-ds-muted-foreground">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.venue.name}</span>
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            {event.isFree ? (
              <span className="text-sm font-semibold text-ds-success">
                {t(locale, "events.free_event")}
              </span>
            ) : event.price ? (
              <span className="text-lg font-bold text-ds-foreground">
                {formatCurrency(event.price.amount, event.price.currencyCode, locale as any)}
              </span>
            ) : null}
          </div>
          {event.availableTickets != null && (
            <span className="text-xs text-ds-muted-foreground">
              {event.availableTickets} {t(locale, "events.tickets_available")}
            </span>
          )}
        </div>

        {ticketPercent != null && (
          <div className="w-full h-1.5 bg-ds-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-ds-primary rounded-full transition-all"
              style={{ width: `${Math.min(ticketPercent, 100)}%` }}
            />
          </div>
        )}

        <Link
          to={`${prefix}/events/${event.id}` as any}
          className="block w-full text-center px-3 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:bg-ds-primary/90 transition-colors"
        >
          {event.status === "sold-out"
            ? t(locale, "events.sold_out")
            : t(locale, "events.get_tickets")}
        </Link>
      </div>
    </div>
  )
}
