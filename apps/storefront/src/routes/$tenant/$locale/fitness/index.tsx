import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/fitness/")({
  component: FitnessPage,
})

function FitnessPage() {
  const { tenant, locale } = Route.useParams()
  const [classes, setClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/fitness")
      .then((res) => res.json())
      .then((data) => {
        setClasses(data.classes || data.fitness || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Fitness & Training</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Find fitness classes, personal trainers, and wellness programs. Start your journey to a healthier lifestyle today.
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
        ) : classes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No fitness classes available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((item) => (
              <FitnessCard key={item.id} item={item} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FitnessCard({ item, tenant, locale }: { item: any; tenant: string; locale: string }) {
  return (
    <Link
      to={`/${tenant}/${locale}/fitness/${item.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-zinc-100 relative">
        {(item.photo || item.thumbnail || item.image) ? (
          <img
            src={item.photo || item.thumbnail || item.image}
            alt={item.name || item.title || item.class_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
        )}
        {item.type && (
          <span className="absolute top-3 left-3 bg-zinc-900/80 text-white text-xs font-medium px-2 py-1 rounded">
            {item.type}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 text-lg">{item.class_name || item.name || item.title}</h3>
        {(item.trainer_name || item.trainer || item.instructor) && (
          <p className="text-sm text-zinc-500 mt-1">
            with {item.trainer_name || item.trainer || item.instructor}
          </p>
        )}
        {(item.schedule || item.time) && (
          <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {item.schedule || item.time}
          </p>
        )}
        {(item.price || item.rate) != null && (
          <div className="mt-3">
            <span className="text-lg font-bold text-zinc-900">
              ${Number(item.price || item.rate).toLocaleString()}
            </span>
            <span className="text-sm text-zinc-500"> {item.price_type || "/ session"}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
