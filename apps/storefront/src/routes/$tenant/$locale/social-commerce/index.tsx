import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/social-commerce/")({
  component: SocialCommercePage,
})

function SocialCommercePage() {
  const { tenant, locale } = Route.useParams()
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/social-commerce")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.social_commerce || data.streams || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Social Commerce</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Join live shopping streams and group buys. Connect with sellers in real-time and discover exclusive deals.
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
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No live streams or group buys at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/${tenant}/${locale}/social-commerce/${item.id}` as any}
                className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-zinc-100 relative">
                  {(item.thumbnail || item.image) ? (
                    <img src={item.thumbnail || item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </div>
                  )}
                  {item.status && (
                    <span className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded ${item.status === "live" ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-200"}`}>
                      {item.status === "live" ? "LIVE" : item.status}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-zinc-900 text-lg">{item.title || item.name}</h3>
                  {item.host && (
                    <p className="text-sm text-zinc-500 mt-1">Hosted by {item.host}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    {item.viewers != null && (
                      <span className="text-sm text-zinc-400">{item.viewers.toLocaleString()} viewers</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
