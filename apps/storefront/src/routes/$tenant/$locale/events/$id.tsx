import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/events/$id")({
  component: EventDetailPage,
})

function EventDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/event-ticketing/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data.event || data.item || data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Event not found</p>
          <Link
            to={`/${tenant}/${locale}/events` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link
            to={`/${tenant}/${locale}/events` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to events
          </Link>
          <h1 className="text-3xl font-bold">{event.name || event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-zinc-400">
            {event.date && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                {formatDate(event.date)}
              </span>
            )}
            {event.time && <span>{event.time}</span>}
            {event.venue && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {event.venue}
              </span>
            )}
          </div>
        </div>
      </div>

      {(event.image || event.thumbnail) && (
        <div className="content-container pt-8">
          <div className="rounded-lg overflow-hidden h-80 bg-zinc-100">
            <img src={event.image || event.thumbnail} alt={event.name || event.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {event.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About This Event</h2>
                <p className="text-zinc-600 leading-relaxed">{event.description}</p>
              </div>
            )}

            {event.ticket_types && event.ticket_types.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Ticket Types</h2>
                <div className="space-y-3">
                  {event.ticket_types.map((ticket: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-zinc-100 rounded-lg hover:border-zinc-300 transition-colors">
                      <div>
                        <p className="font-medium text-zinc-900">{ticket.name || ticket.type}</p>
                        {ticket.description && (
                          <p className="text-sm text-zinc-500 mt-0.5">{ticket.description}</p>
                        )}
                        {ticket.available != null && (
                          <p className="text-xs text-zinc-400 mt-1">{ticket.available} remaining</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-zinc-900">${ticket.price}</p>
                        <button className="mt-1 text-sm bg-zinc-900 text-white px-4 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.lineup && event.lineup.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Lineup</h2>
                <div className="space-y-2">
                  {event.lineup.map((artist: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <span className="text-zinc-600">{artist.name || artist}</span>
                      {artist.time && <span className="text-sm text-zinc-400">{artist.time}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Event Details</h3>
              <div className="space-y-3 text-sm">
                {event.date && (
                  <div>
                    <span className="text-zinc-400 block">Date</span>
                    <span className="text-zinc-700">{formatDate(event.date)}</span>
                  </div>
                )}
                {event.time && (
                  <div>
                    <span className="text-zinc-400 block">Time</span>
                    <span className="text-zinc-700">{event.time}</span>
                  </div>
                )}
                {event.venue && (
                  <div>
                    <span className="text-zinc-400 block">Venue</span>
                    <span className="text-zinc-700">{event.venue}</span>
                  </div>
                )}
                {event.address && (
                  <div>
                    <span className="text-zinc-400 block">Address</span>
                    <span className="text-zinc-700">{event.address}</span>
                  </div>
                )}
                {event.organizer && (
                  <div>
                    <span className="text-zinc-400 block">Organizer</span>
                    <span className="text-zinc-700">{event.organizer}</span>
                  </div>
                )}
              </div>
              {(event.price_range || event.price != null) && (
                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <p className="text-lg font-bold text-zinc-900">
                    {event.price_range || `From $${event.price}`}
                  </p>
                </div>
              )}
              <button className="w-full mt-4 bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
