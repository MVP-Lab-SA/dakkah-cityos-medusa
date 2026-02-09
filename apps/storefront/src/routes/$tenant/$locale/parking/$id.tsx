import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/parking/$id")({
  component: ParkingDetailPage,
})

function ParkingDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [zone, setZone] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/parking/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setZone(data.parking_zone || data.zone || data.item || data)
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

  if (!zone) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Parking zone not found</p>
          <Link to={`/${tenant}/${locale}/parking` as any} className="text-sm font-medium text-zinc-900 hover:underline">
            Back to parking zones
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link to={`/${tenant}/${locale}/parking` as any} className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6">
            ← Back to parking zones
          </Link>
          <h1 className="text-3xl font-bold">{zone.name || zone.zone_name}</h1>
          {zone.location && <p className="text-zinc-300 mt-2">{zone.location}</p>}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {zone.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About This Zone</h2>
                <p className="text-zinc-600 leading-relaxed">{zone.description}</p>
              </div>
            )}
            {zone.rules && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Parking Rules</h2>
                <p className="text-zinc-600 leading-relaxed">{zone.rules}</p>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Zone Details</h3>
              <dl className="space-y-3">
                {(zone.hourly_rate != null || zone.rate != null) && (
                  <div>
                    <dt className="text-sm text-zinc-400">Hourly Rate</dt>
                    <dd className="text-2xl font-bold text-zinc-900">${Number(zone.hourly_rate || zone.rate || 0).toFixed(2)}</dd>
                  </div>
                )}
                {zone.availability != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Available Spots</dt>
                    <dd className={`font-medium ${zone.availability > 0 ? "text-green-600" : "text-red-600"}`}>
                      {zone.availability > 0 ? `${zone.availability} spots available` : "Currently full"}
                    </dd>
                  </div>
                )}
                {zone.total_spots != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Total Capacity</dt>
                    <dd className="text-zinc-900 font-medium">{zone.total_spots} spots</dd>
                  </div>
                )}
                {zone.operating_hours && (
                  <div>
                    <dt className="text-sm text-zinc-400">Operating Hours</dt>
                    <dd className="text-zinc-900 font-medium">{zone.operating_hours}</dd>
                  </div>
                )}
              </dl>
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors mt-6">
                Reserve Spot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
