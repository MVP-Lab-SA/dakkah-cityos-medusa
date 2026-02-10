import React from 'react'
import { Link } from '@tanstack/react-router'

interface BookingCtaBlockProps {
  heading?: string
  description?: string
  serviceId?: string
  providerId?: string
  variant?: 'inline' | 'card' | 'full-width'
  showAvailability?: boolean
  showPricing?: boolean
}

export const BookingCtaBlock: React.FC<BookingCtaBlockProps> = ({
  heading = 'Book Your Appointment',
  description,
  serviceId,
  providerId,
  variant = 'card',
  showAvailability,
  showPricing,
}) => {
  const bookingUrl = serviceId
    ? `/bookings?service=${serviceId}${providerId ? `&provider=${providerId}` : ''}`
    : '/bookings'

  if (variant === 'inline') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-ds-card border border-ds-border rounded-xl p-6 md:p-8">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-2">
                {heading}
              </h2>
              {description && (
                <p className="text-ds-muted-foreground">{description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3">
                {showAvailability && (
                  <span className="text-sm text-ds-muted-foreground">
                    Check available times
                  </span>
                )}
                {showPricing && (
                  <span className="text-sm text-ds-muted-foreground">
                    View pricing
                  </span>
                )}
              </div>
            </div>
            <Link
              to={bookingUrl}
              className="px-8 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'full-width') {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-ds-primary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-primary-foreground mb-4">
            {heading}
          </h2>
          {description && (
            <p className="text-ds-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {showAvailability && (
              <span className="text-sm text-ds-primary-foreground/70">
                Check available times
              </span>
            )}
            {showPricing && (
              <span className="text-sm text-ds-primary-foreground/70">
                View pricing
              </span>
            )}
          </div>
          <Link
            to={bookingUrl}
            className="inline-block px-8 py-3 bg-ds-background text-ds-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Book Now
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-xl">
        <div className="bg-ds-card border border-ds-border rounded-xl p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-4">
            {heading}
          </h2>
          {description && (
            <p className="text-ds-muted-foreground mb-6">{description}</p>
          )}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {showAvailability && (
              <span className="text-sm text-ds-muted-foreground">
                Check available times
              </span>
            )}
            {showPricing && (
              <span className="text-sm text-ds-muted-foreground">
                View pricing
              </span>
            )}
          </div>
          <Link
            to={bookingUrl}
            className="inline-block px-8 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Book Now
          </Link>
        </div>
      </div>
    </section>
  )
}
