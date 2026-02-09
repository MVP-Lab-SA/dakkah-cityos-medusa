import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/education/$id")({
  component: CourseDetailPage,
})

function CourseDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/education/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data.course || data.item || data)
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

  if (!course) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Course not found</p>
          <Link
            to={`/${tenant}/${locale}/education` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to courses
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
            to={`/${tenant}/${locale}/education` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to courses
          </Link>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          {course.instructor && (
            <p className="text-zinc-300 mt-2">by {course.instructor}</p>
          )}
          <div className="flex items-center gap-6 mt-4 text-sm text-zinc-400">
            {course.duration && <span>Duration: {course.duration}</span>}
            {course.lessons_count && <span>{course.lessons_count} lessons</span>}
            {course.level && <span>Level: {course.level}</span>}
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {course.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About This Course</h2>
                <p className="text-zinc-600 leading-relaxed">{course.description}</p>
              </div>
            )}

            {course.lessons && course.lessons.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                  Course Content ({course.lessons.length} lessons)
                </h2>
                <div className="divide-y divide-zinc-100">
                  {course.lessons.map((lesson: any, i: number) => (
                    <div key={lesson.id || i} className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-medium text-zinc-600">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium text-zinc-900">{lesson.title}</p>
                          {lesson.description && (
                            <p className="text-sm text-zinc-500 mt-0.5">{lesson.description}</p>
                          )}
                        </div>
                      </div>
                      {lesson.duration && (
                        <span className="text-sm text-zinc-400">{lesson.duration}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-600">
                      <span className="text-zinc-400 mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} className="w-full rounded-lg mb-4" />
              )}
              {course.price != null && (
                <div className="text-3xl font-bold text-zinc-900 mb-4">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </div>
              )}
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                Enroll Now
              </button>
              <div className="mt-6 space-y-3 text-sm">
                {course.duration && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                )}
                {course.level && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Level</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                )}
                {course.language && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Language</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
