import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/legal/")({
  component: LegalPage,
})

function LegalPage() {
  const { tenant, locale } = Route.useParams()
  const [attorneys, setAttorneys] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/legal")
      .then((res) => res.json())
      .then((data) => {
        setAttorneys(data.attorneys || data.legal || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Legal Services</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Connect with experienced attorneys and legal professionals. Browse profiles, specializations, and schedule consultations.
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
        ) : attorneys.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No attorneys listed at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attorneys.map((attorney) => (
              <AttorneyCard key={attorney.id} attorney={attorney} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AttorneyCard({ attorney, tenant, locale }: { attorney: any; tenant: string; locale: string }) {
  return (
    <Link
      to={`/${tenant}/${locale}/legal/${attorney.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-100 flex-shrink-0 overflow-hidden">
            {(attorney.photo || attorney.avatar || attorney.image) ? (
              <img
                src={attorney.photo || attorney.avatar || attorney.image}
                alt={attorney.name || attorney.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 font-semibold text-xl">
                {(attorney.name || "?").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-zinc-900 text-lg">{attorney.name || attorney.title}</h3>
            {(attorney.specialization || attorney.specialty || attorney.practice_area) && (
              <span className="inline-block mt-1 text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                {attorney.specialization || attorney.specialty || attorney.practice_area}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {(attorney.hourly_rate || attorney.rate) != null && (
            <div>
              <p className="text-xs text-zinc-400 uppercase">Hourly Rate</p>
              <p className="font-bold text-zinc-900">${attorney.hourly_rate || attorney.rate}</p>
            </div>
          )}
          {(attorney.years_experience || attorney.experience) != null && (
            <div>
              <p className="text-xs text-zinc-400 uppercase">Experience</p>
              <p className="font-bold text-zinc-900">{attorney.years_experience || attorney.experience} years</p>
            </div>
          )}
        </div>

        {attorney.bar_number && (
          <p className="text-xs text-zinc-400 mt-3">Bar #{attorney.bar_number}</p>
        )}
      </div>
    </Link>
  )
}
