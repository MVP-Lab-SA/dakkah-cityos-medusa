import { createFileRoute, Link } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { useCustomerBookings } from "@/lib/hooks/use-bookings"
import { formatPrice } from "@/lib/utils/price"
import { Calendar, ChevronRight, Clock } from "@medusajs/icons"
import { useState } from "react"

export const Route = createFileRoute("/$countryCode/account/bookings/")({
  component: BookingsPage,
})

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  canceled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  no_show: "bg-zinc-100 text-zinc-700",
}

function BookingsPage() {
  const { countryCode } = Route.useParams() as { countryCode: string }
  const { data: bookings, isLoading } = useCustomerBookings()
  const baseHref = `/${countryCode}`
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming")

  const now = new Date()
  const filteredBookings = bookings?.filter((booking) => {
    const bookingDate = new Date(booking.scheduled_at)
    if (filter === "upcoming") return bookingDate > now && booking.status !== "canceled"
    if (filter === "past") return bookingDate <= now || booking.status === "completed"
    return true
  })

  return (
    <AccountLayout title="Bookings" description="Manage your scheduled appointments">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["upcoming", "past", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === f
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-zinc-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !filteredBookings?.length ? (
        <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
          <Calendar className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500 mb-4">
            {filter === "upcoming"
              ? "No upcoming bookings"
              : filter === "past"
              ? "No past bookings"
              : "No bookings yet"}
          </p>
          <Link
            to={`${baseHref}/bookings` as any}
            className="inline-flex items-center text-sm font-medium text-zinc-900 hover:underline"
          >
            Book a service
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const scheduledDate = new Date(booking.scheduled_at)
            return (
              <Link
                key={booking.id}
                to={`${baseHref}/account/bookings/${booking.id}` as any}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors"
              >
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-zinc-100 rounded-lg flex-shrink-0">
                  <span className="text-xs font-medium text-zinc-500 uppercase">
                    {scheduledDate.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="text-2xl font-bold text-zinc-900">
                    {scheduledDate.getDate()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900">{booking.service.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-sm text-zinc-500">
                      <Clock className="h-4 w-4" />
                      {scheduledDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                    {booking.provider && (
                      <span className="text-sm text-zinc-500">with {booking.provider.name}</span>
                    )}
                  </div>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                      statusColors[booking.status] || "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-zinc-900">
                    {formatPrice(booking.service.price, booking.service.currency_code || "usd")}
                  </p>
                  <p className="text-sm text-zinc-500">{booking.service.duration} min</p>
                </div>

                <ChevronRight className="h-5 w-5 text-zinc-400 flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </AccountLayout>
  )
}
