import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/parking/")({
  component: ParkingPage,
})

function ParkingPage() {
  const { tenant, locale } = Route.useParams()
  const [zones, setZones] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/parking")
      .then((res) => res.json())
      .then((data) => {
        setZones(data.parking_zones || data.zones || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Parking Zones</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Find and reserve parking spots across the city. Check availability and rates in real-time.
          </p>
        </div>
      </section>

      <div className="content-container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <p className="text-zinc-500">No parking zones available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zones.map((zone) => (
              <Link
                key={zone.id}
                to={`/${tenant}/${locale}/parking/${zone.id}` as any}
                className="bg-white rounded-lg border border-zinc-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-zinc-900 text-lg">{zone.name || zone.zone_name}</h3>
                  {zone.availability != null && (
                    <span className={`text-xs font-medium px-2 py-1 rounded ${zone.availability > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {zone.availability > 0 ? `${zone.availability} spots` : "Full"}
                    </span>
                  )}
                </div>
                {zone.location && (
                  <p className="text-sm text-zinc-500 mb-2">{zone.location}</p>
                )}
                {(zone.hourly_rate != null || zone.rate != null) && (
                  <p className="text-lg font-bold text-zinc-900 mt-3">
                    ${Number(zone.hourly_rate || zone.rate || 0).toFixed(2)}<span className="text-sm font-normal text-zinc-400">/hr</span>
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
