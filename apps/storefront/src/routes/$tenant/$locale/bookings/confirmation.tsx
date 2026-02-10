import { createFileRoute } from "@tanstack/react-router"
import { useBooking } from "@/lib/hooks/use-bookings"
import { CheckCircleSolid, Calendar, Clock, Spinner } from "@medusajs/icons"
import { ProviderCard } from "@/components/bookings"

export const Route = createFileRoute("/$tenant/$locale/bookings/confirmation")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || "",
  }),
  component: BookingConfirmationPage,
})

function BookingConfirmationPage() {
  const { tenant, locale } = Route.useParams()
  const { id: bookingId } = Route.useSearch()
  const { data: booking, isLoading } = useBooking(bookingId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ds-muted flex items-center justify-center">
        <Spinner className="w-8 h-8 text-ds-muted-foreground animate-spin" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-ds-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ds-foreground mb-2">
            Booking Not Found
          </h1>
          <p className="text-ds-muted-foreground mb-6">
            We couldn't find this booking. It may have been canceled or doesn't
            exist.
          </p>
          <a
            href={`/${tenant}/${locale}/bookings`}
            className="btn-enterprise-primary"
          >
            Browse Services
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ds-muted flex items-center justify-center py-12">
      <div className="content-container max-w-lg text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-ds-success flex items-center justify-center mx-auto mb-6">
          <CheckCircleSolid className="w-10 h-10 text-ds-success" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-ds-foreground mb-3">
          Booking Confirmed!
        </h1>

        {/* Confirmation Code */}
        <p className="text-lg text-ds-muted-foreground mb-2">
          Your confirmation code is:
        </p>
        <div className="inline-block bg-ds-muted rounded-lg px-4 py-2 mb-8">
          <span className="text-xl font-mono font-bold text-ds-foreground">
            {booking.confirmation_code}
          </span>
        </div>

        {/* Booking Details Card */}
        <div className="enterprise-card text-left mb-8">
          <div className="enterprise-card-body space-y-4">
            {/* Service */}
            <div>
              <div className="text-sm text-ds-muted-foreground">Service</div>
              <div className="font-semibold text-ds-foreground">
                {booking.service?.name}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="text-sm text-ds-muted-foreground">Date</div>
                <div className="flex items-center gap-2 font-medium text-ds-foreground">
                  <Calendar className="w-4 h-4 text-ds-muted-foreground" />
                  {formatDate(booking.start_time)}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-ds-muted-foreground">Time</div>
                <div className="flex items-center gap-2 font-medium text-ds-foreground">
                  <Clock className="w-4 h-4 text-ds-muted-foreground" />
                  {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </div>
              </div>
            </div>

            {/* Provider */}
            {booking.provider && (
              <div>
                <div className="text-sm text-ds-muted-foreground mb-2">Provider</div>
                <ProviderCard provider={booking.provider} />
              </div>
            )}

            {/* Notes */}
            {booking.notes && (
              <div>
                <div className="text-sm text-ds-muted-foreground">Notes</div>
                <div className="text-ds-foreground">{booking.notes}</div>
              </div>
            )}

            {/* Price */}
            <div className="border-t border-ds-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-ds-muted-foreground">Total Paid</span>
                <span className="text-xl font-bold text-ds-foreground">
                  {formatPrice(booking.price, booking.currency_code)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="enterprise-card text-left mb-8">
          <div className="enterprise-card-header">
            <h2 className="font-semibold text-ds-foreground">What's Next</h2>
          </div>
          <div className="enterprise-card-body">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircleSolid className="w-5 h-5 text-ds-success flex-shrink-0" />
                <span className="text-ds-muted-foreground">
                  A confirmation email has been sent to your email address.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleSolid className="w-5 h-5 text-ds-success flex-shrink-0" />
                <span className="text-ds-muted-foreground">
                  You'll receive a reminder 24 hours before your appointment.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleSolid className="w-5 h-5 text-ds-success flex-shrink-0" />
                <span className="text-ds-muted-foreground">
                  You can reschedule or cancel up to 24 hours before the
                  appointment.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`/${tenant}/${locale}/account/bookings`}
            className="btn-enterprise-primary"
          >
            View My Bookings
          </a>
          <a href={`/${tenant}/${locale}`} className="btn-enterprise-secondary">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  )
}
