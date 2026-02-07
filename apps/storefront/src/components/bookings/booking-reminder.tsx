import { Link } from "@tanstack/react-router"
import { Booking } from "@/lib/types/bookings"
import { BellAlert, Calendar, Clock, ChevronRight } from "@medusajs/icons"

interface BookingReminderProps {
  booking: Booking
  countryCode: string
}

export function BookingReminder({ booking, countryCode }: BookingReminderProps) {
  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (d.toDateString() === now.toDateString()) {
      return "Today"
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    }
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeUntil = (date: string) => {
    const now = new Date()
    const target = new Date(date)
    const diff = target.getTime() - now.getTime()
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `in ${days} day${days > 1 ? "s" : ""}`
    } else if (hours > 0) {
      return `in ${hours} hour${hours > 1 ? "s" : ""}`
    } else {
      return "soon"
    }
  }

  const isToday = new Date(booking.scheduled_at).toDateString() === new Date().toDateString()

  return (
    <Link
      to={`/${countryCode}/account/bookings/${booking.id}` as any}
      className={`block rounded-xl border p-4 transition-all hover:shadow-sm ${
        isToday 
          ? "bg-blue-50 border-blue-200 hover:border-blue-300" 
          : "bg-white border-zinc-200 hover:border-zinc-300"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isToday ? "bg-blue-100" : "bg-zinc-100"
        }`}>
          <BellAlert className={`w-5 h-5 ${isToday ? "text-blue-600" : "text-zinc-600"}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-zinc-900 truncate">{booking.service.name}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isToday 
                ? "bg-blue-200 text-blue-800" 
                : "bg-zinc-200 text-zinc-600"
            }`}>
              {getTimeUntil(booking.scheduled_at)}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-zinc-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(booking.scheduled_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(booking.scheduled_at)}
            </span>
          </div>

          {booking.provider && (
            <p className="text-sm text-zinc-500 mt-1">
              With: {booking.provider.name}
            </p>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-zinc-400" />
      </div>
    </Link>
  )
}
