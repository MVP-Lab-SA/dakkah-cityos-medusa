import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/classifieds/$id")({
  component: ClassifiedDetailPage,
})

function ClassifiedDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [item, setItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/classifieds/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data.classified || data.item || data)
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

  if (!item) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Listing not found</p>
          <Link
            to={`/${tenant}/${locale}/classifieds` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to classifieds
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
            to={`/${tenant}/${locale}/classifieds` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to classifieds
          </Link>
          <h1 className="text-3xl font-bold">{item.title || item.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            {item.category && (
              <span className="text-sm bg-zinc-800 text-zinc-300 px-3 py-1 rounded">
                {item.category}
              </span>
            )}
            {item.location && (
              <span className="text-sm text-zinc-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {item.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {(item.image || item.thumbnail || item.photo) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img
                  src={item.image || item.thumbnail || item.photo}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {item.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Description</h2>
                <p className="text-zinc-600 leading-relaxed">{item.description}</p>
              </div>
            )}

            {item.features && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Features</h2>
                <ul className="list-disc list-inside text-zinc-600 space-y-1">
                  {(Array.isArray(item.features) ? item.features : [item.features]).map((f: any, i: number) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              {item.price != null && (
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-zinc-900">
                    ${Number(item.price).toLocaleString()}
                  </p>
                  {item.condition && (
                    <p className="text-sm text-zinc-500 mt-1">Condition: {item.condition}</p>
                  )}
                </div>
              )}

              {(item.date_posted || item.created_at) && (
                <p className="text-sm text-zinc-500 text-center mb-4">
                  Posted {new Date(item.date_posted || item.created_at).toLocaleDateString()}
                </p>
              )}

              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                Contact Seller
              </button>

              {item.seller && (
                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <p className="text-sm text-zinc-400">Posted by</p>
                  <p className="font-medium text-zinc-900">{item.seller.name || item.seller}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
