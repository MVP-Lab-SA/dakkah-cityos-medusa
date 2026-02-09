import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/utilities/")({
  component: UtilitiesPage,
})

function UtilitiesPage() {
  const { tenant, locale } = Route.useParams()
  const [utilities, setUtilities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/utilities")
      .then((res) => res.json())
      .then((data) => {
        setUtilities(data.utilities || data.services || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Utility Services</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Manage your electricity, water, gas, and other essential utility services.
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
        ) : utilities.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No utility services available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utilities.map((utility) => (
              <Link
                key={utility.id}
                to={`/${tenant}/${locale}/utilities/${utility.id}` as any}
                className="bg-white rounded-lg border border-zinc-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-zinc-900 text-lg">{utility.name || utility.utility_type || utility.title}</h3>
                  {utility.status && (
                    <span className={`text-xs font-medium px-2 py-1 rounded ${utility.status === "active" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
                      {utility.status}
                    </span>
                  )}
                </div>
                {utility.utility_type && utility.name && (
                  <p className="text-sm text-zinc-500 mb-2">Type: {utility.utility_type}</p>
                )}
                {utility.provider && (
                  <p className="text-sm text-zinc-400">Provider: {utility.provider}</p>
                )}
                {utility.description && (
                  <p className="text-sm text-zinc-500 mt-3 line-clamp-2">{utility.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
