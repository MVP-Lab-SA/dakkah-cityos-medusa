import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/social-commerce/$id")({
  component: SocialCommerceDetailPage,
})

function SocialCommerceDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [item, setItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/social-commerce/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data.social_commerce || data.stream || data.item || data)
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
          <p className="text-zinc-500 mb-4">Stream not found</p>
          <Link to={`/${tenant}/${locale}/social-commerce` as any} className="text-sm font-medium text-zinc-900 hover:underline">
            Back to social commerce
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link to={`/${tenant}/${locale}/social-commerce` as any} className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6">
            ← Back to social commerce
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{item.title || item.name}</h1>
            {item.status === "live" && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">LIVE</span>
            )}
          </div>
          {item.host && <p className="text-zinc-300 mt-2">Hosted by {item.host}</p>}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {(item.thumbnail || item.image) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img src={item.thumbnail || item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
              </div>
            )}
            {item.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About</h2>
                <p className="text-zinc-600 leading-relaxed">{item.description}</p>
              </div>
            )}
            {item.products && item.products.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Featured Products</h2>
                <div className="grid grid-cols-2 gap-4">
                  {item.products.map((product: any, i: number) => (
                    <div key={i} className="border border-zinc-100 rounded-lg p-3">
                      <p className="font-medium text-zinc-900">{product.name || product.title}</p>
                      {product.price != null && (
                        <p className="text-sm font-bold text-zinc-700 mt-1">${Number(product.price).toFixed(2)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Stream Details</h3>
              <dl className="space-y-3">
                {item.status && (
                  <div>
                    <dt className="text-sm text-zinc-400">Status</dt>
                    <dd>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${item.status === "live" ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-600"}`}>
                        {item.status}
                      </span>
                    </dd>
                  </div>
                )}
                {item.host && (
                  <div>
                    <dt className="text-sm text-zinc-400">Host</dt>
                    <dd className="text-zinc-900 font-medium">{item.host}</dd>
                  </div>
                )}
                {item.viewers != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Viewers</dt>
                    <dd className="text-zinc-900 font-medium">{item.viewers.toLocaleString()}</dd>
                  </div>
                )}
                {item.scheduled_at && (
                  <div>
                    <dt className="text-sm text-zinc-400">Scheduled</dt>
                    <dd className="text-zinc-900 font-medium">{new Date(item.scheduled_at).toLocaleString()}</dd>
                  </div>
                )}
              </dl>
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors mt-6">
                {item.status === "live" ? "Join Stream" : "Set Reminder"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
