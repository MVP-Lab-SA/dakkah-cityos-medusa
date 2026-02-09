import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/freelance/$id")({
  component: FreelanceDetailPage,
})

function FreelanceDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [gig, setGig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/freelance/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGig(data.freelancer || data.gig || data.item || data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? "text-amber-400" : "text-zinc-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
      </svg>
    ))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Gig not found</p>
          <Link
            to={`/${tenant}/${locale}/freelance` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to freelance
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
            to={`/${tenant}/${locale}/freelance` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to freelance
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
              {(gig.avatar || gig.photo || gig.image) ? (
                <img
                  src={gig.avatar || gig.photo || gig.image}
                  alt={gig.freelancer_name || gig.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 font-semibold text-2xl">
                  {(gig.freelancer_name || gig.name || "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{gig.title || gig.name}</h1>
              {(gig.freelancer_name || gig.freelancer) && (
                <p className="text-zinc-400 mt-1">{gig.freelancer_name || gig.freelancer}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {gig.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About This Gig</h2>
                <p className="text-zinc-600 leading-relaxed">{gig.description}</p>
              </div>
            )}

            {gig.skills && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(gig.skills) ? gig.skills : [gig.skills]).map((skill: any, i: number) => (
                    <span key={i} className="bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {gig.portfolio && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Portfolio</h2>
                <div className="grid grid-cols-2 gap-4">
                  {(Array.isArray(gig.portfolio) ? gig.portfolio : []).map((item: any, i: number) => (
                    <div key={i} className="rounded-lg overflow-hidden bg-zinc-100 h-40">
                      <img src={item.image || item} alt={item.title || `Work ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gig.reviews && gig.reviews.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Reviews</h2>
                <div className="divide-y divide-zinc-100">
                  {gig.reviews.map((review: any, i: number) => (
                    <div key={i} className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating || 5)}</div>
                        <span className="text-sm font-medium text-zinc-900">{review.author || `Client ${i + 1}`}</span>
                      </div>
                      <p className="text-sm text-zinc-600 mt-1">{review.comment || review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              {(gig.rate || gig.hourly_rate || gig.price) != null && (
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-zinc-900">
                    ${gig.rate || gig.hourly_rate || gig.price}
                  </p>
                  <p className="text-sm text-zinc-500">{gig.rate_type || "per hour"}</p>
                </div>
              )}

              {gig.rating != null && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex">{renderStars(gig.rating)}</div>
                  <span className="text-sm font-medium text-zinc-700">{Number(gig.rating).toFixed(1)}</span>
                  {gig.reviews_count != null && (
                    <span className="text-sm text-zinc-400">({gig.reviews_count} reviews)</span>
                  )}
                </div>
              )}

              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                Hire Now
              </button>

              {gig.response_time && (
                <p className="text-sm text-zinc-500 text-center mt-3">
                  Avg. response time: {gig.response_time}
                </p>
              )}

              {gig.completed_projects != null && (
                <div className="mt-6 pt-4 border-t border-zinc-100 text-sm text-center text-zinc-600">
                  {gig.completed_projects} projects completed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
