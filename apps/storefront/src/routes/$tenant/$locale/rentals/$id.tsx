import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/rentals/$id")({
  component: RentalDetailPage,
})

function RentalDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [rental, setRental] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/rentals/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRental(data.rental || data.item || data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!rental) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Rental item not found</p>
          <Link
            to={`/${tenant}/${locale}/rentals` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to rentals
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
            to={`/${tenant}/${locale}/rentals` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to rentals
          </Link>
          <h1 className="text-3xl font-bold">{rental.name || rental.title}</h1>
          {rental.category && (
            <span className="inline-block mt-2 text-sm bg-zinc-800 text-zinc-300 px-3 py-1 rounded">
              {rental.category}
            </span>
          )}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {(rental.photo || rental.thumbnail || rental.image) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img
                  src={rental.photo || rental.thumbnail || rental.image}
                  alt={rental.name || rental.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {rental.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Description</h2>
                <p className="text-zinc-600 leading-relaxed">{rental.description}</p>
              </div>
            )}

            {rental.specifications && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(rental.specifications).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-zinc-50">
                      <span className="text-zinc-500 capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="font-medium text-zinc-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rental.terms && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Rental Terms</h2>
                <p className="text-zinc-600 leading-relaxed">{rental.terms}</p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              {(rental.daily_rate || rental.price_per_day) != null && (
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-zinc-900">
                    ${rental.daily_rate || rental.price_per_day}
                  </p>
                  <p className="text-sm text-zinc-500">per day</p>
                </div>
              )}

              {rental.availability != null && (
                <div className={`text-center mb-4 py-2 rounded text-sm font-medium ${
                  rental.availability === true || rental.availability === "available"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}>
                  {rental.availability === true || rental.availability === "available"
                    ? "Available for rent"
                    : "Currently unavailable"}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                  Reserve Now
                </button>
              </div>

              {rental.weekly_rate && (
                <div className="mt-6 pt-4 border-t border-zinc-100 space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Weekly rate</span>
                    <span className="font-medium">${rental.weekly_rate}/week</span>
                  </div>
                  {rental.monthly_rate && (
                    <div className="flex justify-between text-zinc-600">
                      <span>Monthly rate</span>
                      <span className="font-medium">${rental.monthly_rate}/month</span>
                    </div>
                  )}
                </div>
              )}

              {rental.deposit && (
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <p className="text-sm text-zinc-500">
                    Security deposit: <span className="font-medium text-zinc-900">${rental.deposit}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
