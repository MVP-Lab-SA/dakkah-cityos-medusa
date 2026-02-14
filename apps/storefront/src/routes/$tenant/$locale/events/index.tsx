// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { t } from "@/lib/i18n"
import { EventCard } from "@/components/events/event-card"
import { EventFilter } from "@/components/events/event-filter"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/events/")({
  component: EventsPage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/events`, {
        headers: {
          "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_56377e90449a39fc4585675802137b09577cd6e17f339eba6dc923eaf22e3445",
        },
      })
      if (!resp.ok) return { events: [], count: 0 }
      const data = await resp.json()
      return { events: data.items || [], count: data.count || 0 }
    } catch {
      return { events: [], count: 0 }
    }
  },
})

function EventsPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const loaderData = Route.useLoaderData()
  const [filters, setFilters] = useState<Record<string, unknown>>({})
  const [events, setEvents] = useState<any[]>(loaderData?.events || [])

  useEffect(() => {
    if (loaderData?.events && loaderData.events.length > 0) {
      setEvents(loaderData.events)
    }
  }, [loaderData])

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">
              {t(locale, "common.home")}
            </Link>
            <span>/</span>
            <span className="text-ds-foreground">{t(locale, "events.title")}</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">
            {t(locale, "events.browse_events")}
          </h1>
          <p className="mt-2 text-ds-muted-foreground">
            Discover and book tickets for concerts, festivals, conferences, and local events.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <EventFilter
              locale={locale}
              filters={filters as any}
              onFilterChange={setFilters}
            />
          </aside>

          <main className="flex-1">
            {events.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg
                  className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4"
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
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">
                  {t(locale, "events.no_events")}
                </h3>
                <p className="text-ds-muted-foreground text-sm">
                  Check back later for upcoming events.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event: any) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    locale={locale}
                    prefix={prefix}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
