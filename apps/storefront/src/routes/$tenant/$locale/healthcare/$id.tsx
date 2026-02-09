import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/healthcare/$id")({
  component: PractitionerDetailPage,
})

function PractitionerDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [practitioner, setPractitioner] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/healthcare/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPractitioner(data.practitioner || data.item || data)
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

  if (!practitioner) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Practitioner not found</p>
          <Link
            to={`/${tenant}/${locale}/healthcare` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to practitioners
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
            to={`/${tenant}/${locale}/healthcare` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to practitioners
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-full bg-zinc-700 overflow-hidden flex-shrink-0">
              {practitioner.photo || practitioner.thumbnail ? (
                <img src={practitioner.photo || practitioner.thumbnail} alt={practitioner.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-zinc-400">{practitioner.name?.charAt(0)}</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{practitioner.name}</h1>
              {practitioner.specialization && (
                <p className="text-zinc-300 mt-2 text-lg">{practitioner.specialization}</p>
              )}
              {practitioner.rating != null && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(practitioner.rating) ? "text-yellow-400" : "text-zinc-600"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-zinc-300">{practitioner.rating} rating</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {practitioner.bio && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About</h2>
                <p className="text-zinc-600 leading-relaxed">{practitioner.bio}</p>
              </div>
            )}
            {practitioner.qualifications && practitioner.qualifications.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Qualifications</h2>
                <ul className="space-y-2">
                  {practitioner.qualifications.map((q: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-600">
                      <span className="text-zinc-400 mt-1">•</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {practitioner.services && practitioner.services.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Services</h2>
                <div className="space-y-3">
                  {practitioner.services.map((service: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
                      <span className="text-zinc-700">{service.name || service}</span>
                      {service.price && <span className="font-medium text-zinc-900">${service.price}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                {practitioner.email && (
                  <div>
                    <span className="text-zinc-400 block">Email</span>
                    <span className="text-zinc-700">{practitioner.email}</span>
                  </div>
                )}
                {practitioner.phone && (
                  <div>
                    <span className="text-zinc-400 block">Phone</span>
                    <span className="text-zinc-700">{practitioner.phone}</span>
                  </div>
                )}
                {practitioner.location && (
                  <div>
                    <span className="text-zinc-400 block">Location</span>
                    <span className="text-zinc-700">{practitioner.location}</span>
                  </div>
                )}
              </div>
            </div>
            {practitioner.availability && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h3 className="font-semibold text-zinc-900 mb-4">Availability</h3>
                <p className="text-sm text-zinc-600">{practitioner.availability}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
