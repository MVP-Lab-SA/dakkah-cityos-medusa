import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/automotive/$id")({
  component: AutomotiveDetailPage,
})

function AutomotiveDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [vehicle, setVehicle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/automotive/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setVehicle(data.automotive || data.vehicle || data.item || data)
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

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Vehicle not found</p>
          <Link to={`/${tenant}/${locale}/automotive` as any} className="text-sm font-medium text-zinc-900 hover:underline">
            Back to vehicles
          </Link>
        </div>
      </div>
    )
  }

  const title = `${vehicle.year ? vehicle.year + " " : ""}${vehicle.make || ""} ${vehicle.model || vehicle.name || vehicle.title || ""}`.trim()

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link to={`/${tenant}/${locale}/automotive` as any} className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6">
            ← Back to vehicles
          </Link>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {(vehicle.photo || vehicle.thumbnail || vehicle.image) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img src={vehicle.photo || vehicle.thumbnail || vehicle.image} alt={title} className="w-full h-full object-cover" />
              </div>
            )}
            {vehicle.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Description</h2>
                <p className="text-zinc-600 leading-relaxed">{vehicle.description}</p>
              </div>
            )}
            {vehicle.features && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Features</h2>
                <p className="text-zinc-600 leading-relaxed">{vehicle.features}</p>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <p className="text-sm text-zinc-400 uppercase">Price</p>
                <p className="text-3xl font-bold text-zinc-900 mt-1">${Number(vehicle.price || 0).toLocaleString()}</p>
              </div>
              <dl className="space-y-3">
                {vehicle.year && (
                  <div>
                    <dt className="text-sm text-zinc-400">Year</dt>
                    <dd className="text-zinc-900 font-medium">{vehicle.year}</dd>
                  </div>
                )}
                {vehicle.make && (
                  <div>
                    <dt className="text-sm text-zinc-400">Make</dt>
                    <dd className="text-zinc-900 font-medium">{vehicle.make}</dd>
                  </div>
                )}
                {vehicle.model && (
                  <div>
                    <dt className="text-sm text-zinc-400">Model</dt>
                    <dd className="text-zinc-900 font-medium">{vehicle.model}</dd>
                  </div>
                )}
                {vehicle.mileage != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Mileage</dt>
                    <dd className="text-zinc-900 font-medium">{Number(vehicle.mileage).toLocaleString()} miles</dd>
                  </div>
                )}
                {vehicle.condition && (
                  <div>
                    <dt className="text-sm text-zinc-400">Condition</dt>
                    <dd className="text-zinc-900 font-medium">{vehicle.condition}</dd>
                  </div>
                )}
                {vehicle.color && (
                  <div>
                    <dt className="text-sm text-zinc-400">Color</dt>
                    <dd className="text-zinc-900 font-medium">{vehicle.color}</dd>
                  </div>
                )}
              </dl>
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors mt-6">
                Contact Dealer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
