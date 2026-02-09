import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/fitness/$id")({
  component: FitnessDetailPage,
})

function FitnessDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [item, setItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/fitness/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data.class || data.fitness || data.item || data)
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
          <p className="text-zinc-500 mb-4">Class not found</p>
          <Link
            to={`/${tenant}/${locale}/fitness` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to fitness
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
            to={`/${tenant}/${locale}/fitness` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to fitness
          </Link>
          <h1 className="text-3xl font-bold">{item.class_name || item.name || item.title}</h1>
          <div className="flex items-center gap-3 mt-3">
            {(item.trainer_name || item.trainer || item.instructor) && (
              <span className="text-sm text-zinc-400">
                with {item.trainer_name || item.trainer || item.instructor}
              </span>
            )}
            {item.type && (
              <span className="text-sm bg-zinc-800 text-zinc-300 px-3 py-1 rounded">
                {item.type}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {(item.photo || item.thumbnail || item.image) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img
                  src={item.photo || item.thumbnail || item.image}
                  alt={item.class_name || item.name || item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {item.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About This Class</h2>
                <p className="text-zinc-600 leading-relaxed">{item.description}</p>
              </div>
            )}

            {(item.schedule || item.time || item.days) && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Schedule</h2>
                <div className="space-y-2 text-zinc-600">
                  {item.schedule && <p>{item.schedule}</p>}
                  {item.time && <p>Time: {item.time}</p>}
                  {item.days && (
                    <p>Days: {Array.isArray(item.days) ? item.days.join(", ") : item.days}</p>
                  )}
                  {item.duration && <p>Duration: {item.duration}</p>}
                </div>
              </div>
            )}

            {item.equipment && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Equipment Needed</h2>
                <ul className="list-disc list-inside text-zinc-600 space-y-1">
                  {(Array.isArray(item.equipment) ? item.equipment : [item.equipment]).map((e: any, i: number) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              {(item.price || item.rate) != null && (
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-zinc-900">
                    ${Number(item.price || item.rate).toLocaleString()}
                  </p>
                  <p className="text-sm text-zinc-500">{item.price_type || "per session"}</p>
                </div>
              )}

              {item.difficulty && (
                <div className="mb-4 text-center">
                  <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                    item.difficulty === "beginner" ? "bg-green-100 text-green-700" :
                    item.difficulty === "intermediate" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                  </span>
                </div>
              )}

              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                Book Class
              </button>

              <div className="mt-6 pt-4 border-t border-zinc-100 space-y-3 text-sm">
                {item.capacity != null && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Class size</span>
                    <span className="font-medium">{item.capacity} spots</span>
                  </div>
                )}
                {item.duration && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Duration</span>
                    <span className="font-medium">{item.duration}</span>
                  </div>
                )}
                {item.location && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Location</span>
                    <span className="font-medium">{item.location}</span>
                  </div>
                )}
              </div>

              {(item.trainer_name || item.trainer || item.instructor) && (
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <p className="text-sm text-zinc-400">Instructor</p>
                  <p className="font-medium text-zinc-900">{item.trainer_name || item.trainer || item.instructor}</p>
                  {item.trainer_bio && <p className="text-sm text-zinc-500 mt-1">{item.trainer_bio}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
