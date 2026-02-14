// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/fitness/")({
  component: FitnessPage,
  loader: async () => {
    try {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? "http://localhost:9000" : ""
      const resp = await fetch(`${baseUrl}/store/fitness`, {
        headers: {
          "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_56377e90449a39fc4585675802137b09577cd6e17f339eba6dc923eaf22e3445",
        },
      })
      if (!resp.ok) return { items: [], count: 0 }
      const data = await resp.json()
      return { items: data.items || data.listings || data.products || [], count: data.count || 0 }
    } catch {
      return { items: [], count: 0 }
    }
  },
})

const classTypes = ["all", "yoga", "hiit", "pilates", "spinning", "strength", "dance", "boxing"] as const
const levels = ["all", "beginner", "intermediate", "advanced"] as const
const schedules = ["all", "morning", "afternoon", "evening", "weekend"] as const

function FitnessPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [classType, setClassType] = useState("all")
  const [level, setLevel] = useState("all")
  const [schedule, setSchedule] = useState("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const loaderData = Route.useLoaderData()
  const data = loaderData
  const isLoading = false
  const error = null

  const classes = data?.classes || []
  const totalPages = Math.ceil((data?.count || 0) / limit)
  const filtered = classes.filter((c: any) =>
    searchQuery ? c.name?.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Fitness</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Fitness Classes</h1>
          <p className="mt-2 text-ds-muted-foreground">Find the perfect class to reach your fitness goals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search classes..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Class Type</label>
                <div className="space-y-1">
                  {classTypes.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setClassType(opt); setPage(1) }}
                      className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${classType === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}
                    >
                      {opt === "all" ? "All Types" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Level</label>
                <div className="space-y-1">
                  {levels.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setLevel(opt); setPage(1) }}
                      className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${level === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}
                    >
                      {opt === "all" ? "All Levels" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Schedule</label>
                <div className="space-y-1">
                  {schedules.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSchedule(opt); setPage(1) }}
                      className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${schedule === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}
                    >
                      {opt === "all" ? "All Schedules" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {error ? (
              <div className="bg-ds-destructive/10 border border-ds-destructive/20 rounded-xl p-8 text-center">
                <svg className="w-12 h-12 text-ds-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-ds-destructive font-medium">Something went wrong loading fitness classes.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden">
                    <div className="aspect-[4/3] bg-ds-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-1/3 bg-ds-muted rounded animate-pulse" />
                      <div className="h-8 w-full bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !filtered || filtered.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No fitness classes found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((cls: any) => (
                    <a
                      key={cls.id}
                      href={`${prefix}/fitness/${cls.id}`}
                      className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200"
                    >
                      <div className="aspect-[4/3] bg-ds-muted relative overflow-hidden">
                        {(cls.image_url || cls.thumbnail) && <img src={cls.image_url || cls.thumbnail} alt={cls.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                        {cls.level && (
                          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full bg-ds-primary text-ds-primary-foreground">
                            {cls.level}
                          </span>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{cls.name || "Untitled Class"}</h3>
                        {cls.instructor && <p className="text-sm text-ds-muted-foreground">with {cls.instructor}</p>}
                        <div className="flex items-center gap-3 text-xs text-ds-muted-foreground">
                          {cls.schedule && <span>{cls.schedule}</span>}
                          {cls.duration && <span>{cls.duration} min</span>}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-bold text-ds-foreground">{cls.price ? `$${(cls.price / 100).toFixed(2)}` : "Free"}</span>
                          <span className="text-sm font-medium text-ds-primary group-hover:underline">View Details →</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                    <span className="px-4 py-2 text-sm text-ds-muted-foreground">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
