import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/real-estate/$id")({
  component: PropertyDetailPage,
})

function PropertyDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [property, setProperty] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/real-estate/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data.property || data.item || data)
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

  if (!property) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Property not found</p>
          <Link
            to={`/${tenant}/${locale}/real-estate` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to listings
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
            to={`/${tenant}/${locale}/real-estate` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to listings
          </Link>
          <h1 className="text-3xl font-bold">{property.title}</h1>
          {property.location && (
            <p className="text-zinc-300 mt-2">{property.location}</p>
          )}
          {property.price != null && (
            <p className="text-2xl font-bold mt-3">${Number(property.price).toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="content-container py-12">
        {(property.photo || property.thumbnail || property.image) && (
          <div className="mb-8 rounded-lg overflow-hidden h-96 bg-zinc-100">
            <img
              src={property.photo || property.thumbnail || property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms != null && (
                  <div className="text-center p-4 bg-zinc-50 rounded-lg">
                    <p className="text-2xl font-bold text-zinc-900">{property.bedrooms}</p>
                    <p className="text-sm text-zinc-500">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="text-center p-4 bg-zinc-50 rounded-lg">
                    <p className="text-2xl font-bold text-zinc-900">{property.bathrooms}</p>
                    <p className="text-sm text-zinc-500">Bathrooms</p>
                  </div>
                )}
                {property.area && (
                  <div className="text-center p-4 bg-zinc-50 rounded-lg">
                    <p className="text-2xl font-bold text-zinc-900">{property.area}</p>
                    <p className="text-sm text-zinc-500">Sq Ft</p>
                  </div>
                )}
                {property.year_built && (
                  <div className="text-center p-4 bg-zinc-50 rounded-lg">
                    <p className="text-2xl font-bold text-zinc-900">{property.year_built}</p>
                    <p className="text-sm text-zinc-500">Year Built</p>
                  </div>
                )}
              </div>
            </div>

            {property.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Description</h2>
                <p className="text-zinc-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Features</h2>
                <div className="grid grid-cols-2 gap-2">
                  {property.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Interested in this property?</h3>
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors mb-3">
                Schedule a Viewing
              </button>
              <button className="w-full border border-zinc-200 text-zinc-700 py-3 rounded-lg font-medium hover:bg-zinc-50 transition-colors">
                Contact Agent
              </button>
              {property.agent && (
                <div className="mt-6 pt-6 border-t border-zinc-100">
                  <p className="text-sm text-zinc-400">Listed by</p>
                  <p className="font-medium text-zinc-900">{property.agent.name || property.agent}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
