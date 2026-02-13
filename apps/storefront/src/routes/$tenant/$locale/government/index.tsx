// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/government/")({
  component: GovernmentPage,
})

const departments = ["all", "transportation", "health", "education", "housing", "finance", "environment", "public-safety"] as const
const serviceTypes = ["all", "permit", "license", "registration", "application", "renewal", "inspection"] as const

function GovernmentPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [department, setDepartment] = useState("all")
  const [serviceType, setServiceType] = useState("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const { data, isLoading, error } = useQuery({
    queryKey: ["government", department, serviceType, page],
    queryFn: () =>
      sdk.client.fetch<{ services: any[]; count: number }>(`/store/government`, {
        query: {
          ...(department !== "all" && { department }),
          ...(serviceType !== "all" && { service_type: serviceType }),
          limit,
          offset: (page - 1) * limit,
        },
      }),
  })

  const services = data?.services || []
  const totalPages = Math.ceil((data?.count || 0) / limit)
  const filtered = services.filter((s: any) =>
    searchQuery ? (s.name || s.title || "").toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Government Services</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Government Services</h1>
          <p className="mt-2 text-ds-muted-foreground">Access permits, licenses, and public services online</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search services..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Department</label>
                <div className="space-y-1">
                  {departments.map((opt) => (
                    <button key={opt} onClick={() => { setDepartment(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${department === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Departments" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Service Type</label>
                <div className="space-y-1">
                  {serviceTypes.map((opt) => (
                    <button key={opt} onClick={() => { setServiceType(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${serviceType === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Types" : opt.charAt(0).toUpperCase() + opt.slice(1)}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading government services.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-3">
                    <div className="h-10 w-10 bg-ds-muted rounded-lg animate-pulse" />
                    <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-full bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-ds-muted rounded animate-pulse" />
                    <div className="h-8 w-full bg-ds-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : !filtered || filtered.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No government services found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((service: any) => (
                    <a key={service.id} href={`${prefix}/government/${service.id}`} className="group bg-ds-background border border-ds-border rounded-xl p-6 hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-ds-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors line-clamp-1">{service.name || "Government Service"}</h3>
                          {service.department && <p className="text-xs text-ds-muted-foreground">{service.department}</p>}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-ds-muted-foreground mb-4">
                        {service.processing_time && (
                          <div className="flex justify-between">
                            <span>Processing Time</span>
                            <span className="font-medium text-ds-foreground">{service.processing_time}</span>
                          </div>
                        )}
                        {service.fee != null && (
                          <div className="flex justify-between">
                            <span>Fee</span>
                            <span className="font-medium text-ds-foreground">{service.fee > 0 ? `$${(service.fee / 100).toFixed(2)}` : "Free"}</span>
                          </div>
                        )}
                        {service.service_type && (
                          <div className="flex justify-between">
                            <span>Type</span>
                            <span className="font-medium text-ds-foreground capitalize">{service.service_type}</span>
                          </div>
                        )}
                      </div>
                      {service.requirements && (
                        <div className="mb-4">
                          <p className="text-xs text-ds-muted-foreground mb-1">Requirements:</p>
                          <p className="text-xs text-ds-foreground line-clamp-2">{Array.isArray(service.requirements) ? service.requirements.join(", ") : service.requirements}</p>
                        </div>
                      )}
                      <div className="pt-3 border-t border-ds-border">
                        <span className="text-sm font-medium text-ds-primary group-hover:underline">Apply Now →</span>
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
