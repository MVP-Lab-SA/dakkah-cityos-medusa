import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/healthcare/")({
  component: HealthcarePage,
})

function HealthcarePage() {
  const { tenant, locale } = Route.useParams()
  const [practitioners, setPractitioners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/healthcare")
      .then((res) => res.json())
      .then((data) => {
        setPractitioners(data.practitioners || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Healthcare Practitioners</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Find trusted healthcare professionals. Browse specialists, read reviews, and book appointments with qualified practitioners.
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
        ) : practitioners.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
            </div>
            <p className="text-zinc-500">No practitioners available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practitioners.map((practitioner) => (
              <PractitionerCard key={practitioner.id} practitioner={practitioner} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PractitionerCard({ practitioner, tenant, locale }: { practitioner: any; tenant: string; locale: string }) {
  return (
    <Link
      to={`/${tenant}/${locale}/healthcare/${practitioner.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-zinc-100">
        {practitioner.photo || practitioner.thumbnail ? (
          <img
            src={practitioner.photo || practitioner.thumbnail}
            alt={practitioner.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-zinc-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-zinc-400">
                {practitioner.name?.charAt(0) || "?"}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 text-lg">{practitioner.name}</h3>
        {practitioner.specialization && (
          <p className="text-sm text-zinc-500 mt-1">{practitioner.specialization}</p>
        )}
        {practitioner.rating != null && (
          <div className="flex items-center gap-1 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(practitioner.rating) ? "text-yellow-400" : "text-zinc-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-zinc-500 ml-1">{practitioner.rating}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
