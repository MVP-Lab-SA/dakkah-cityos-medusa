import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/utilities/$id")({
  component: UtilityDetailPage,
})

function UtilityDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [utility, setUtility] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/utilities/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUtility(data.utility || data.service || data.item || data)
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

  if (!utility) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Utility service not found</p>
          <Link to={`/${tenant}/${locale}/utilities` as any} className="text-sm font-medium text-zinc-900 hover:underline">
            Back to utilities
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link to={`/${tenant}/${locale}/utilities` as any} className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6">
            ← Back to utilities
          </Link>
          <h1 className="text-3xl font-bold">{utility.name || utility.utility_type || utility.title}</h1>
          {utility.provider && <p className="text-zinc-300 mt-2">Provider: {utility.provider}</p>}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {utility.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Description</h2>
                <p className="text-zinc-600 leading-relaxed">{utility.description}</p>
              </div>
            )}
            {utility.coverage_area && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Coverage Area</h2>
                <p className="text-zinc-600 leading-relaxed">{utility.coverage_area}</p>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Service Details</h3>
              <dl className="space-y-3">
                {utility.utility_type && (
                  <div>
                    <dt className="text-sm text-zinc-400">Type</dt>
                    <dd className="text-zinc-900 font-medium">{utility.utility_type}</dd>
                  </div>
                )}
                {utility.provider && (
                  <div>
                    <dt className="text-sm text-zinc-400">Provider</dt>
                    <dd className="text-zinc-900 font-medium">{utility.provider}</dd>
                  </div>
                )}
                {utility.status && (
                  <div>
                    <dt className="text-sm text-zinc-400">Status</dt>
                    <dd>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${utility.status === "active" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
                        {utility.status}
                      </span>
                    </dd>
                  </div>
                )}
                {utility.rate != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Rate</dt>
                    <dd className="text-zinc-900 font-medium">${Number(utility.rate).toFixed(2)}/mo</dd>
                  </div>
                )}
              </dl>
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors mt-6">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
