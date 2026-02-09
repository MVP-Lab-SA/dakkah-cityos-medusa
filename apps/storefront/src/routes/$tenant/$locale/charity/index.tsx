import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/charity/")({
  component: CharityPage,
})

function CharityPage() {
  const { tenant, locale } = Route.useParams()
  const [charities, setCharities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/charity")
      .then((res) => res.json())
      .then((data) => {
        setCharities(data.charities || data.campaigns || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Charities & Campaigns</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Support meaningful causes and make a difference. Browse active campaigns and contribute to the ones that matter to you.
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
        ) : charities.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No active campaigns at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charities.map((charity) => (
              <CharityCard key={charity.id} charity={charity} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CharityCard({ charity, tenant, locale }: { charity: any; tenant: string; locale: string }) {
  const raised = Number(charity.raised || charity.current_amount || 0)
  const goal = Number(charity.goal || charity.target_amount || 1)
  const progress = Math.min((raised / goal) * 100, 100)

  return (
    <Link
      to={`/${tenant}/${locale}/charity/${charity.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-zinc-100 relative">
        {(charity.image || charity.thumbnail || charity.photo) ? (
          <img
            src={charity.image || charity.thumbnail || charity.photo}
            alt={charity.name || charity.org_name || charity.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
        )}
        {(charity.cause || charity.category) && (
          <span className="absolute top-3 left-3 bg-zinc-900/80 text-white text-xs font-medium px-2 py-1 rounded">
            {charity.cause || charity.category}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 text-lg">{charity.org_name || charity.name || charity.title}</h3>
        {charity.cause && !charity.category && (
          <p className="text-sm text-zinc-500 mt-1">{charity.cause}</p>
        )}

        {(charity.goal || charity.target_amount) != null && (
          <div className="mt-4">
            <div className="w-full bg-zinc-100 rounded-full h-2.5">
              <div
                className="bg-zinc-900 h-2.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="font-medium text-zinc-900">${raised.toLocaleString()} raised</span>
              <span className="text-zinc-500">${goal.toLocaleString()} goal</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
