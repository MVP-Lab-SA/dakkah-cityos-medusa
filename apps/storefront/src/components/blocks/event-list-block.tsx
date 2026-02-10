import React from 'react'
import { Link } from '@tanstack/react-router'

interface EventItem {
  id: string
  title: string
  description?: string
  date: string
  endDate?: string
  location?: string
  image?: {
    url: string
    alt?: string
  }
  url?: string
  category?: string
  price?: string
}

interface EventListBlockProps {
  heading?: string
  description?: string
  events: EventItem[]
  layout?: 'timeline' | 'grid' | 'list' | 'calendar'
  showPastEvents?: boolean
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

function isPast(dateStr: string): boolean {
  try {
    return new Date(dateStr) < new Date()
  } catch {
    return false
  }
}

export const EventListBlock: React.FC<EventListBlockProps> = ({
  heading,
  description,
  events,
  layout = 'grid',
  showPastEvents = true,
}) => {
  const filteredEvents = showPastEvents
    ? events
    : events.filter((e) => !isPast(e.endDate || e.date))

  if (!filteredEvents || filteredEvents.length === 0) return null

  const EventCard = ({ event }: { event: EventItem }) => {
    const Wrapper = event.url ? Link : 'div'
    const wrapperProps = event.url
      ? { to: event.url, className: 'block' }
      : { className: 'block' }

    return (
      <Wrapper
        {...(wrapperProps as any)}
        className="bg-ds-card border border-ds-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
      >
        {event.image?.url && (
          <div className="aspect-video overflow-hidden">
            <img
              src={event.image.url}
              alt={event.image.alt || event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            {event.category && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-ds-accent text-ds-accent-foreground">
                {event.category}
              </span>
            )}
            {isPast(event.endDate || event.date) && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-ds-muted text-ds-muted-foreground">
                Past
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-ds-foreground mb-2">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-ds-muted-foreground text-sm mb-3 line-clamp-2">
              {event.description}
            </p>
          )}
          <div className="flex flex-col gap-1 text-sm text-ds-muted-foreground">
            <span>{formatDate(event.date)}{event.endDate ? ` - ${formatDate(event.endDate)}` : ''}</span>
            {event.location && <span>{event.location}</span>}
            {event.price && (
              <span className="font-semibold text-ds-foreground">{event.price}</span>
            )}
          </div>
        </div>
      </Wrapper>
    )
  }

  const renderTimeline = () => (
    <div className="relative">
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-ds-border" />
      <div className="flex flex-col gap-8">
        {filteredEvents.map((event) => (
          <div key={event.id} className="relative pl-10 md:pl-20">
            <div className="absolute left-3 md:left-7 top-2 w-3 h-3 rounded-full bg-ds-primary border-2 border-ds-background" />
            <div className="text-sm font-medium text-ds-muted-foreground mb-2">
              {formatDate(event.date)} {formatTime(event.date)}
            </div>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  )

  const renderList = () => (
    <div className="flex flex-col gap-4">
      {filteredEvents.map((event) => (
        <div key={event.id} className="flex gap-4 bg-ds-card border border-ds-border rounded-xl p-4 md:p-6">
          {event.image?.url && (
            <img
              src={event.image.url}
              alt={event.image.alt || event.title}
              className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {event.category && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-ds-accent text-ds-accent-foreground">
                  {event.category}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-ds-foreground mb-1">{event.title}</h3>
            {event.description && (
              <p className="text-ds-muted-foreground text-sm mb-2 line-clamp-2">{event.description}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ds-muted-foreground">
              <span>{formatDate(event.date)}</span>
              {event.location && <span>{event.location}</span>}
              {event.price && <span className="font-semibold text-ds-foreground">{event.price}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-4">
            {heading}
          </h2>
        )}
        {description && (
          <p className="text-ds-muted-foreground mb-8 max-w-2xl">
            {description}
          </p>
        )}

        {layout === 'timeline' ? (
          renderTimeline()
        ) : layout === 'list' ? (
          renderList()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
