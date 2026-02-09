import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/pet-services/$id")({
  component: PetServiceDetailPage,
})

function PetServiceDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [service, setService] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/pet-services/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setService(data.pet_service || data.service || data.item || data)
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

  if (!service) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Pet service not found</p>
          <Link to={`/${tenant}/${locale}/pet-services` as any} className="text-sm font-medium text-zinc-900 hover:underline">
            Back to pet services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link to={`/${tenant}/${locale}/pet-services` as any} className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6">
            ← Back to pet services
          </Link>
          <h1 className="text-3xl font-bold">{service.name || service.title}</h1>
          {service.pet_type && <p className="text-zinc-300 mt-2">For: {service.pet_type}</p>}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {(service.photo || service.thumbnail || service.image) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img src={service.photo || service.thumbnail || service.image} alt={service.name || service.title} className="w-full h-full object-cover" />
              </div>
            )}
            {service.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Description</h2>
                <p className="text-zinc-600 leading-relaxed">{service.description}</p>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Service Details</h3>
              <dl className="space-y-3">
                {service.pet_type && (
                  <div>
                    <dt className="text-sm text-zinc-400">Pet Type</dt>
                    <dd className="text-zinc-900 font-medium">{service.pet_type}</dd>
                  </div>
                )}
                {service.price != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Price</dt>
                    <dd className="text-2xl font-bold text-zinc-900">${Number(service.price).toFixed(2)}</dd>
                  </div>
                )}
                {service.duration && (
                  <div>
                    <dt className="text-sm text-zinc-400">Duration</dt>
                    <dd className="text-zinc-900 font-medium">{service.duration}</dd>
                  </div>
                )}
                {service.provider && (
                  <div>
                    <dt className="text-sm text-zinc-400">Provider</dt>
                    <dd className="text-zinc-900 font-medium">{service.provider}</dd>
                  </div>
                )}
              </dl>
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors mt-6">
                Book Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
