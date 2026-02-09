import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/legal/$id")({
  component: LegalDetailPage,
})

function LegalDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [attorney, setAttorney] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/legal/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAttorney(data.attorney || data.legal || data.item || data)
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

  if (!attorney) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Attorney not found</p>
          <Link
            to={`/${tenant}/${locale}/legal` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to legal services
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
            to={`/${tenant}/${locale}/legal` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to legal services
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
              {(attorney.photo || attorney.avatar || attorney.image) ? (
                <img
                  src={attorney.photo || attorney.avatar || attorney.image}
                  alt={attorney.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 font-semibold text-2xl">
                  {(attorney.name || "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{attorney.name || attorney.title}</h1>
              {(attorney.specialization || attorney.specialty || attorney.practice_area) && (
                <span className="inline-block mt-2 text-sm bg-zinc-800 text-zinc-300 px-3 py-1 rounded">
                  {attorney.specialization || attorney.specialty || attorney.practice_area}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {attorney.bio && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About</h2>
                <p className="text-zinc-600 leading-relaxed">{attorney.bio}</p>
              </div>
            )}

            {attorney.description && !attorney.bio && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About</h2>
                <p className="text-zinc-600 leading-relaxed">{attorney.description}</p>
              </div>
            )}

            {attorney.practice_areas && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Practice Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(attorney.practice_areas) ? attorney.practice_areas : [attorney.practice_areas]).map((area: any, i: number) => (
                    <span key={i} className="bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {attorney.education && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Education</h2>
                <ul className="space-y-2 text-zinc-600">
                  {(Array.isArray(attorney.education) ? attorney.education : [attorney.education]).map((edu: any, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                      </svg>
                      {typeof edu === "string" ? edu : edu.school || edu.institution}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {attorney.cases && attorney.cases.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Notable Cases</h2>
                <div className="divide-y divide-zinc-100">
                  {attorney.cases.map((c: any, i: number) => (
                    <div key={i} className="py-3">
                      <p className="font-medium text-zinc-900">{c.title || c.name}</p>
                      {c.description && <p className="text-sm text-zinc-500 mt-1">{c.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <div className="space-y-4 mb-6">
                {(attorney.hourly_rate || attorney.rate) != null && (
                  <div className="text-center">
                    <p className="text-sm text-zinc-400">Hourly Rate</p>
                    <p className="text-3xl font-bold text-zinc-900">${attorney.hourly_rate || attorney.rate}</p>
                  </div>
                )}
                {(attorney.years_experience || attorney.experience) != null && (
                  <div className="text-center">
                    <p className="text-sm text-zinc-400">Experience</p>
                    <p className="text-xl font-bold text-zinc-900">{attorney.years_experience || attorney.experience} years</p>
                  </div>
                )}
              </div>

              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                Schedule Consultation
              </button>

              <div className="mt-6 pt-4 border-t border-zinc-100 space-y-3 text-sm">
                {attorney.bar_number && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Bar Number</span>
                    <span className="font-medium">{attorney.bar_number}</span>
                  </div>
                )}
                {attorney.jurisdiction && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Jurisdiction</span>
                    <span className="font-medium">{attorney.jurisdiction}</span>
                  </div>
                )}
                {attorney.location && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Location</span>
                    <span className="font-medium">{attorney.location}</span>
                  </div>
                )}
              </div>

              {(attorney.email || attorney.phone) && (
                <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2">
                  {attorney.email && (
                    <a href={`mailto:${attorney.email}`} className="block text-sm text-zinc-600 hover:text-zinc-900">
                      {attorney.email}
                    </a>
                  )}
                  {attorney.phone && (
                    <a href={`tel:${attorney.phone}`} className="block text-sm text-zinc-600 hover:text-zinc-900">
                      {attorney.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
