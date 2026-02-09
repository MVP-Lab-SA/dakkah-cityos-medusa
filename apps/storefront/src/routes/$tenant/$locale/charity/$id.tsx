import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/charity/$id")({
  component: CharityDetailPage,
})

function CharityDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [charity, setCharity] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/charity/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCharity(data.charity || data.campaign || data.item || data)
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

  if (!charity) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Campaign not found</p>
          <Link
            to={`/${tenant}/${locale}/charity` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to charities
          </Link>
        </div>
      </div>
    )
  }

  const raised = Number(charity.raised || charity.current_amount || 0)
  const goal = Number(charity.goal || charity.target_amount || 1)
  const progress = Math.min((raised / goal) * 100, 100)

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link
            to={`/${tenant}/${locale}/charity` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to charities
          </Link>
          <h1 className="text-3xl font-bold">{charity.org_name || charity.name || charity.title}</h1>
          {(charity.cause || charity.category) && (
            <span className="inline-block mt-2 text-sm bg-zinc-800 text-zinc-300 px-3 py-1 rounded">
              {charity.cause || charity.category}
            </span>
          )}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {(charity.image || charity.thumbnail || charity.photo) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img
                  src={charity.image || charity.thumbnail || charity.photo}
                  alt={charity.org_name || charity.name || charity.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {charity.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About This Campaign</h2>
                <p className="text-zinc-600 leading-relaxed">{charity.description}</p>
              </div>
            )}

            {charity.impact && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Our Impact</h2>
                <p className="text-zinc-600 leading-relaxed">{charity.impact}</p>
              </div>
            )}

            {charity.updates && charity.updates.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Updates</h2>
                <div className="divide-y divide-zinc-100">
                  {charity.updates.map((update: any, i: number) => (
                    <div key={i} className="py-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-zinc-900">{update.title || `Update ${i + 1}`}</p>
                        {update.date && (
                          <span className="text-xs text-zinc-400">
                            {new Date(update.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {update.content && <p className="text-sm text-zinc-600 mt-1">{update.content}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {charity.donors && charity.donors.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                  Recent Donors ({charity.donors.length})
                </h2>
                <div className="divide-y divide-zinc-100">
                  {charity.donors.slice(0, 10).map((donor: any, i: number) => (
                    <div key={i} className="py-3 flex items-center justify-between">
                      <span className="text-zinc-700">{donor.name || `Anonymous`}</span>
                      {donor.amount != null && (
                        <span className="font-medium text-zinc-900">${Number(donor.amount).toLocaleString()}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              {(charity.goal || charity.target_amount) != null && (
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-zinc-900">${raised.toLocaleString()}</p>
                    <p className="text-sm text-zinc-500">raised of ${goal.toLocaleString()} goal</p>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-3">
                    <div
                      className="bg-zinc-900 h-3 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-zinc-500 text-center mt-2">{Math.round(progress)}% funded</p>
                </div>
              )}

              {charity.donors_count != null && (
                <p className="text-sm text-zinc-500 text-center mb-4">{charity.donors_count} donors</p>
              )}

              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
                <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                  Donate Now
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    className="flex-1 text-sm border border-zinc-200 rounded-lg py-2 text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {charity.organizer && (
                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <p className="text-sm text-zinc-400">Organized by</p>
                  <p className="font-medium text-zinc-900">{charity.organizer.name || charity.organizer}</p>
                </div>
              )}

              {charity.end_date && (
                <div className="mt-4 pt-4 border-t border-zinc-100 text-center">
                  <p className="text-sm text-zinc-500">
                    Campaign ends {new Date(charity.end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
