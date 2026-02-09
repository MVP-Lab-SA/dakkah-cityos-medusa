import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/classifieds/")({
  component: ClassifiedsPage,
})

function ClassifiedsPage() {
  const { tenant, locale } = Route.useParams()
  const [classifieds, setClassifieds] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/classifieds")
      .then((res) => res.json())
      .then((data) => {
        setClassifieds(data.classifieds || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Classifieds</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Browse classified ads from your community. Find great deals on items, services, and more in your area.
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
        ) : classifieds.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No classified ads posted yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classifieds.map((item) => (
              <ClassifiedCard key={item.id} item={item} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ClassifiedCard({ item, tenant, locale }: { item: any; tenant: string; locale: string }) {
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString()
    } catch {
      return ""
    }
  }

  return (
    <Link
      to={`/${tenant}/${locale}/classifieds/${item.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-zinc-100 relative">
        {(item.image || item.thumbnail || item.photo) ? (
          <img
            src={item.image || item.thumbnail || item.photo}
            alt={item.title || item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
            </svg>
          </div>
        )}
        {item.category && (
          <span className="absolute top-3 left-3 bg-zinc-900/80 text-white text-xs font-medium px-2 py-1 rounded">
            {item.category}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 text-lg">{item.title || item.name}</h3>
        {item.location && (
          <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {item.location}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {(item.price != null) && (
            <span className="text-lg font-bold text-zinc-900">
              ${Number(item.price).toLocaleString()}
            </span>
          )}
          {(item.date_posted || item.created_at) && (
            <span className="text-xs text-zinc-400">
              {formatDate(item.date_posted || item.created_at)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
