import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/travel/$id")({
  component: TravelDetailPage,
})

function TravelDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [property, setProperty] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/travel/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data.property || data.travel || data.item || data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  const renderStars = (stars: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < stars ? "text-amber-400" : "text-zinc-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
      </svg>
    ))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Property not found</p>
          <Link
            to={`/${tenant}/${locale}/travel` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to travel
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link
            to={`/${tenant}/${locale}/travel` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to travel
          </Link>
          <h1 className="text-3xl font-bold">{property.name || property.title}</h1>
          <div className="flex items-center gap-4 mt-3">
            {(property.star_rating || property.stars) != null && (
              <div className="flex">{renderStars(property.star_rating || property.stars)}</div>
            )}
            {property.location && (
              <span className="text-sm text-zinc-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {property.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {(property.photo || property.thumbnail || property.image) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img
                  src={property.photo || property.thumbnail || property.image}
                  alt={property.name || property.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {property.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About This Property</h2>
                <p className="text-zinc-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {property.amenities && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(Array.isArray(property.amenities) ? property.amenities : [property.amenities]).map((a: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.rooms && property.rooms.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Available Rooms</h2>
                <div className="divide-y divide-zinc-100">
                  {property.rooms.map((room: any, i: number) => (
                    <div key={i} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900">{room.name || room.type || `Room ${i + 1}`}</p>
                        {room.description && <p className="text-sm text-zinc-500 mt-1">{room.description}</p>}
                        {room.capacity && <p className="text-xs text-zinc-400 mt-1">Sleeps {room.capacity}</p>}
                      </div>
                      <div className="text-right">
                        {room.price != null && (
                          <p className="font-bold text-zinc-900">${Number(room.price).toLocaleString()}<span className="text-sm font-normal text-zinc-500">/night</span></p>
                        )}
                        <button className="mt-2 text-sm bg-zinc-900 text-white px-4 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              {(property.price_range || property.price || property.price_per_night) != null && (
                <div className="text-center mb-6">
                  <p className="text-sm text-zinc-400">Starting from</p>
                  <p className="text-3xl font-bold text-zinc-900 mt-1">
                    {property.price_range || `$${Number(property.price || property.price_per_night).toLocaleString()}`}
                  </p>
                  {!property.price_range && <p className="text-sm text-zinc-500">per night</p>}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Check-in</label>
                  <input
                    type="date"
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Check-out</label>
                  <input
                    type="date"
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                  Check Availability
                </button>
              </div>

              {property.contact && (
                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <p className="text-sm text-zinc-400">Contact</p>
                  <p className="font-medium text-zinc-900">{property.contact.name || property.contact}</p>
                  {property.contact.phone && <p className="text-sm text-zinc-500">{property.contact.phone}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
