// @ts-nocheck
import { getServerBaseUrl } from "@/lib/utils/env"
import { createFileRoute, Link } from "@tanstack/react-router"

function normalizeDetail(item: any) {
  if (!item) return null
  const meta = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : (item.metadata || {})
  return { ...meta, ...item,
    thumbnail: item.thumbnail || item.photo_url || item.banner_url || item.logo_url || meta.thumbnail || (meta.images && meta.images[0]) || null,
    images: meta.images || [item.photo_url || item.banner_url || item.logo_url].filter(Boolean),
    description: item.description || meta.description || "",
    price: item.price ?? meta.price ?? null,
    rating: item.rating ?? item.avg_rating ?? meta.rating ?? null,
    review_count: item.review_count ?? meta.review_count ?? null,
    location: item.location || item.city || item.address || meta.location || null,
  }
}

export const Route = createFileRoute("/$tenant/$locale/bookings/$id")({
  loader: async ({ params }) => {
    try {
      const baseUrl = getServerBaseUrl()
      const resp = await fetch(`${baseUrl}/store/bookings/${params.id}`, {
        headers: { "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_56377e90449a39fc4585675802137b09577cd6e17f339eba6dc923eaf22e3445" },
      })
      if (!resp.ok) return { item: null }
      const data = await resp.json()
      return { item: normalizeDetail(data.item || data.booking || data.event || data.auction || data) }
    } catch { return { item: null } }
  },
  component: BookingDetailPage,
})

function BookingDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const prefix = `/${tenant}/${locale}`

  const loaderData = Route.useLoaderData()
  const booking = loaderData?.item

  if (!booking) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-ds-foreground mb-2">Booking Not Found</h2>
            <p className="text-ds-muted-foreground mb-6">This booking may have been cancelled or is no longer available.</p>
            <Link to={`${prefix}/bookings` as any} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:bg-ds-primary/90 transition-colors">
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    confirmed: "bg-ds-success/15 text-ds-success",
    pending: "bg-ds-warning/15 text-ds-warning",
    cancelled: "bg-ds-destructive/15 text-ds-destructive",
    completed: "bg-ds-info/15 text-ds-info",
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`${prefix}/bookings` as any} className="hover:text-ds-foreground transition-colors">Bookings</Link>
            <span>/</span>
            <span className="text-ds-foreground truncate">{booking.service_name || booking.title || `Booking #${id}`}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-ds-foreground">
                  {booking.service_name || booking.title || "Service Booking"}
                </h1>
                {booking.status && (
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status] || "bg-ds-muted text-ds-muted-foreground"}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                )}
              </div>
              {booking.description && (
                <p className="text-ds-muted-foreground">{booking.description}</p>
              )}
            </div>

            <div className="bg-ds-background border border-ds-border rounded-xl p-6">
              <h2 className="font-semibold text-ds-foreground mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(booking.date || booking.booking_date || booking.start_time) && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-ds-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-ds-muted-foreground">Date & Time</p>
                      <p className="font-medium text-ds-foreground">
                        {new Date(booking.date || booking.booking_date || booking.start_time).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </p>
                      {(booking.start_time || booking.time) && (
                        <p className="text-sm text-ds-foreground">
                          {booking.time || new Date(booking.start_time).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {booking.duration && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-ds-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-ds-muted-foreground">Duration</p>
                      <p className="font-medium text-ds-foreground">{booking.duration} minutes</p>
                    </div>
                  </div>
                )}

                {(booking.provider_name || booking.provider) && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-ds-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-sm text-ds-muted-foreground">Provider</p>
                      <p className="font-medium text-ds-foreground">
                        {typeof booking.provider === "object" ? booking.provider.name : booking.provider_name || booking.provider}
                      </p>
                    </div>
                  </div>
                )}

                {(booking.location || booking.venue) && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-ds-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-ds-muted-foreground">Location</p>
                      <p className="font-medium text-ds-foreground">{booking.location || booking.venue}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {booking.cancellation_policy && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Cancellation Policy</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed">{booking.cancellation_policy}</p>
              </div>
            )}

            {booking.notes && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Notes</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{booking.notes}</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="sticky top-4 space-y-6">
              <div className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-ds-muted-foreground">Total Price</p>
                  <p className="text-3xl font-bold text-ds-foreground">
                    {booking.price != null ? `$${Number(booking.price / 100).toFixed(2)}` : booking.total ? `$${Number(booking.total).toFixed(2)}` : "Free"}
                  </p>
                </div>

                {booking.status === "pending" && (
                  <button className="w-full py-3 px-4 bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90 transition-colors">
                    Confirm Booking
                  </button>
                )}

                {(booking.status === "confirmed" || booking.status === "pending") && (
                  <button className="w-full py-2.5 px-4 rounded-lg font-medium text-sm border border-ds-border text-ds-foreground hover:bg-ds-muted transition-colors">
                    Reschedule
                  </button>
                )}

                {booking.status !== "cancelled" && booking.status !== "completed" && (
                  <button className="w-full py-2.5 px-4 rounded-lg font-medium text-sm border border-ds-destructive/30 text-ds-destructive hover:bg-ds-destructive/10 transition-colors">
                    Cancel Booking
                  </button>
                )}
              </div>

              {(booking.provider_name || booking.provider) && (
                <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                  <h3 className="font-semibold text-ds-foreground mb-3">Service Provider</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-ds-primary/10 rounded-full flex items-center justify-center text-ds-primary font-semibold">
                      {((typeof booking.provider === "object" ? booking.provider.name : booking.provider_name || booking.provider) || "P").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-ds-foreground">
                        {typeof booking.provider === "object" ? booking.provider.name : booking.provider_name || booking.provider}
                      </p>
                      {booking.provider?.specialty && (
                        <p className="text-sm text-ds-muted-foreground">{booking.provider.specialty}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h3 className="font-semibold text-ds-foreground mb-3">Need Help?</h3>
                <ul className="space-y-2 text-sm text-ds-muted-foreground">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Free cancellation up to 24h before
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Instant confirmation
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Contact support anytime
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
