import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/rentals/")({
  component: RentalsPage,
})

function RentalsPage() {
  const { tenant, locale } = Route.useParams()
  const [rentals, setRentals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/rentals")
      .then((res) => res.json())
      .then((data) => {
        setRentals(data.rentals || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Rentals</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Rent equipment, tools, and more. Browse available items, check availability, and book rentals at competitive daily rates.
          </p>
        </div>
      </section>

      <div className="content-container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No rental items available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RentalCard({ rental, tenant, locale }: { rental: any; tenant: string; locale: string }) {
  return (
    <Link
      to={`/${tenant}/${locale}/rentals/${rental.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-zinc-100 relative">
        {(rental.photo || rental.thumbnail || rental.image) ? (
          <img
            src={rental.photo || rental.thumbnail || rental.image}
            alt={rental.name || rental.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
        )}
        {rental.availability != null && (
          <span className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded ${
            rental.availability === true || rental.availability === "available"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {rental.availability === true || rental.availability === "available" ? "Available" : "Unavailable"}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 text-lg">{rental.name || rental.title}</h3>
        {rental.category && (
          <span className="inline-block mt-1 text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">
            {rental.category}
          </span>
        )}
        {(rental.daily_rate || rental.price_per_day) != null && (
          <div className="mt-3">
            <span className="text-lg font-bold text-zinc-900">
              ${rental.daily_rate || rental.price_per_day}
            </span>
            <span className="text-sm text-zinc-500"> / day</span>
          </div>
        )}
      </div>
    </Link>
  )
}
