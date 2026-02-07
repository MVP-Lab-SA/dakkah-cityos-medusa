import { Link } from "@tanstack/react-router"
import { Booking } from "@/lib/types/bookings"
import { formatPrice } from "@/lib/utils/price"
import { ChevronRight, Calendar } from "@medusajs/icons"
import { cn } from "@/lib/utils/cn"

interface BookingListProps {
  bookings: Booking[]
  countryCode: string
  emptyMessage?: string
}

export function BookingList({ 
  bookings, 
  countryCode, 
  emptyMessage = "No bookings found" 
}: BookingListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <p className="text-zinc-500">{emptyMessage}</p>
        <Link
          to={`/${countryCode}/bookings`}
          className="inline-block mt-4 text-sm font-medium text-zinc-900 hover:underline"
        >
          Browse available services
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Link
          key={booking.id}
          to={`/${countryCode}/account/bookings/${booking.id}`}
          className="block bg-white rounded-xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-zinc-900">{booking.service.name}</h3>
              <p className="text-sm text-zinc-500 mt-0.5">
                {formatDateTime(booking.scheduled_at)}
              </p>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium capitalize",
              getStatusColor(booking.status)
            )}>
              {booking.status}
            </span>
          </div>

          {booking.resource && (
            <p className="text-sm text-zinc-600 mb-4">
              With: {booking.resource.name}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-zinc-400">Duration</p>
                <p className="text-sm text-zinc-700">{booking.service.duration} min</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Price</p>
                <p className="font-semibold text-zinc-900">
                  {formatPrice(booking.service.price, booking.service.currency_code)}
                </p>
              </div>
            </div>
            <span className="text-sm text-zinc-500 flex items-center gap-1">
              View details
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
