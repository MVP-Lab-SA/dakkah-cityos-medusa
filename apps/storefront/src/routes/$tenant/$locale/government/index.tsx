import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/government/")({
  component: GovernmentPage,
})

function GovernmentPage() {
  const { tenant, locale } = Route.useParams()
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/government")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.government_services || data.services || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Government Services</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Access public services, permits, licenses, and government programs all in one place.
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
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21" />
              </svg>
            </div>
            <p className="text-zinc-500">No government services available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/${tenant}/${locale}/government/${service.id}` as any}
                className="bg-white rounded-lg border border-zinc-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-zinc-900 text-lg">{service.name || service.title}</h3>
                  {service.status && (
                    <span className={`text-xs font-medium px-2 py-1 rounded ${service.status === "active" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
                      {service.status}
                    </span>
                  )}
                </div>
                {service.type && (
                  <p className="text-sm text-zinc-500 mb-2">Type: {service.type}</p>
                )}
                {service.department && (
                  <p className="text-sm text-zinc-400">Department: {service.department}</p>
                )}
                {service.description && (
                  <p className="text-sm text-zinc-500 mt-3 line-clamp-2">{service.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
