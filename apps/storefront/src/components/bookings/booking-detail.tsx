import { Booking } from "@/lib/types/bookings"
import { formatPrice } from "@/lib/utils/price"
import { cn } from "@/lib/utils/cn"
import { Calendar, Clock, User, MapPin } from "@medusajs/icons"

interface BookingDetailProps {
  booking: Booking
}

export function BookingDetail({ booking }: BookingDetailProps) {
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">{booking.service.name}</h2>
            <p className="text-zinc-500 mt-1">{booking.service.description}</p>
          </div>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium capitalize",
            getStatusColor(booking.status)
          )}>
            {booking.status}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-6">
        {/* Confirmation Code */}
        {booking.confirmation_code && (
          <div className="bg-zinc-50 rounded-lg p-4">
            <p className="text-xs text-zinc-400 uppercase tracking-wider">Confirmation Code</p>
            <p className="text-lg font-mono font-semibold text-zinc-900 mt-1">
              {booking.confirmation_code}
            </p>
          </div>
        )}

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Date</p>
              <p className="text-sm text-zinc-900 mt-1">{formatDate(booking.scheduled_at)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Time</p>
              <p className="text-sm text-zinc-900 mt-1">{formatTime(booking.scheduled_at)}</p>
            </div>
          </div>
        </div>

        {/* Provider */}
        {booking.provider && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Provider</p>
              <p className="text-sm text-zinc-900 mt-1">{booking.provider.name}</p>
            </div>
          </div>
        )}

        {/* Location */}
        {booking.location && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Location</p>
              <p className="text-sm text-zinc-900 mt-1">{booking.location}</p>
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="pt-4 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Duration</p>
              <p className="text-zinc-900">{booking.service.duration} minutes</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-600">Total</p>
              <p className="text-xl font-semibold text-zinc-900">
                {formatPrice(booking.service.price, booking.service.currency_code)}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="pt-4 border-t border-zinc-200">
            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Notes</p>
            <p className="text-sm text-zinc-600">{booking.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
