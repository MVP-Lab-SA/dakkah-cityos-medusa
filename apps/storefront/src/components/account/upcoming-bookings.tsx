import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { ChevronRight, Calendar, Clock } from "@medusajs/icons"
import type { Booking } from "@/lib/types/bookings"

interface UpcomingBookingsProps {
  bookings: Booking[]
  isLoading?: boolean
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  canceled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
}

export function UpcomingBookings({ bookings, isLoading }: UpcomingBookingsProps) {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-zinc-200">
        <div className="p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Upcoming Bookings</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-zinc-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const upcomingBookings =
    bookings?.filter(
      (b) => b.status === "confirmed" && new Date(b.scheduled_at) > new Date()
    ) || []

  if (!upcomingBookings.length) {
    return (
      <div className="bg-white rounded-lg border border-zinc-200">
        <div className="p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Upcoming Bookings</h2>
        </div>
        <div className="p-8 text-center">
          <Calendar className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500">No upcoming bookings</p>
          <Link
            to={`${baseHref}/bookings` as any}
            className="mt-4 inline-flex items-center text-sm font-medium text-zinc-900 hover:underline"
          >
            Book a service
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-200">
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Upcoming Bookings</h2>
        <Link
          to={`${baseHref}/account/bookings` as any}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          View all
        </Link>
      </div>
      <div className="divide-y divide-zinc-100">
        {upcomingBookings.slice(0, 3).map((booking) => {
          const scheduledDate = new Date(booking.scheduled_at)
          return (
            <Link
              key={booking.id}
              to={`${baseHref}/account/bookings/${booking.id}` as any}
              className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center w-14 h-14 bg-zinc-100 rounded-lg">
                <span className="text-xs font-medium text-zinc-500 uppercase">
                  {scheduledDate.toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="text-xl font-bold text-zinc-900">{scheduledDate.getDate()}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900">{booking.service.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-zinc-400" />
                  <span className="text-sm text-zinc-500">
                    {scheduledDate.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  {booking.provider && (
                    <>
                      <span className="text-zinc-300">|</span>
                      <span className="text-sm text-zinc-500">{booking.provider.name}</span>
                    </>
                  )}
                </div>
              </div>

              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                  statusColors[booking.status] || "bg-zinc-100 text-zinc-700"
                }`}
              >
                {booking.status}
              </span>

              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
