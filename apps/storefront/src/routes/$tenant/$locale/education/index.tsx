import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/education/")({
  component: EducationPage,
})

function EducationPage() {
  const { tenant, locale } = Route.useParams()
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/education")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Online Courses</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Expand your skills with expert-led courses. Learn at your own pace with comprehensive lessons and hands-on projects.
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
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-zinc-500">No courses available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CourseCard({ course, tenant, locale }: { course: any; tenant: string; locale: string }) {
  return (
    <Link
      to={`/${tenant}/${locale}/education/${course.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-44 bg-zinc-100">
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 text-lg line-clamp-2">{course.title}</h3>
        {course.instructor && (
          <p className="text-sm text-zinc-500 mt-1">by {course.instructor}</p>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
          {course.duration && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {course.duration}
            </span>
          )}
          {course.lessons_count && (
            <span>{course.lessons_count} lessons</span>
          )}
        </div>
        {course.price != null && (
          <div className="mt-3">
            <span className="text-lg font-bold text-zinc-900">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
