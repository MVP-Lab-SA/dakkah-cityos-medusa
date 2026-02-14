// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/healthcare/")({
  component: HealthcarePage,
})

const specialtyOptions = ["all", "primary-care", "cardiology", "dermatology", "orthopedics", "pediatrics", "neurology", "psychiatry", "ophthalmology", "dentistry", "physical-therapy"] as const
const availabilityOptions = ["all", "available-today", "this-week", "next-week"] as const
const insuranceOptions = ["all", "accepts-insurance", "cash-only"] as const

function HealthcarePage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [specialty, setSpecialty] = useState<string>("all")
  const [availability, setAvailability] = useState<string>("all")
  const [insurance, setInsurance] = useState<string>("all")
  const [page, setPage] = useState(1)
  const limit = 12

  const { data, isLoading, error } = useQuery({
    queryKey: ["healthcare", specialty, availability, insurance, page],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (specialty !== "all") params.set("specialty", specialty)
      if (availability !== "all") params.set("availability", availability)
      if (insurance !== "all") params.set("insurance", insurance)
      params.set("limit", String(limit))
      params.set("offset", String((page - 1) * limit))
      const qs = params.toString()
      const response = await sdk.client.fetch<{ items: any[]; count: number }>(
        `/store/healthcare${qs ? `?${qs}` : ""}`,
        { method: "GET", credentials: "include" }
      )
      return response
    },
  })

  const items = data?.items || []
  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / limit)

  const filteredItems = items.filter((item) =>
    searchQuery ? item.provider_name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-ds-muted"}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Healthcare</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Browse Healthcare Providers</h1>
          <p className="mt-2 text-ds-muted-foreground">Find trusted healthcare professionals near you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-ds-background border border-ds-border rounded-xl p-4 space-y-6 sticky top-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Search</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search providers..." className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Specialty</label>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {specialtyOptions.map((opt) => (
                    <button key={opt} onClick={() => { setSpecialty(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${specialty === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All Specialties" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Availability</label>
                <div className="space-y-1">
                  {availabilityOptions.map((opt) => (
                    <button key={opt} onClick={() => { setAvailability(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${availability === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "Any Availability" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-2">Insurance</label>
                <div className="space-y-1">
                  {insuranceOptions.map((opt) => (
                    <button key={opt} onClick={() => { setInsurance(opt); setPage(1) }} className={`block w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${insurance === opt ? "bg-ds-primary text-ds-primary-foreground" : "text-ds-foreground hover:bg-ds-muted"}`}>
                      {opt === "all" ? "All" : opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
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
                <p className="text-ds-destructive font-medium">Something went wrong loading healthcare providers.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-ds-background border border-ds-border rounded-xl overflow-hidden p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-ds-muted animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-3/4 bg-ds-muted rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-ds-muted rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-4 w-full bg-ds-muted rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-ds-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-ds-foreground mb-2">No healthcare providers found</h3>
                <p className="text-ds-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item: any) => (
                    <a key={item.id} href={`${prefix}/healthcare/${item.id}`} className="group bg-ds-background border border-ds-border rounded-xl overflow-hidden hover:shadow-lg hover:border-ds-primary/30 transition-all duration-200 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-ds-muted overflow-hidden flex-shrink-0">
                          {(item.photo_url || item.photo) ? (
                            <img src={item.photo_url || item.photo} alt={item.provider_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ds-muted-foreground text-xl font-bold">
                              {(item.provider_name || "D").charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors">{item.provider_name}</h3>
                          {item.specialty && (
                            <span className="text-sm text-ds-primary">{item.specialty.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center gap-1">
                          {renderStars(item.rating || 0)}
                          <span className="text-sm text-ds-muted-foreground ml-1">({item.review_count || 0})</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-ds-muted-foreground">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span>{item.location || "Location TBD"}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.accepts_insurance && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md">Accepts Insurance</span>
                          )}
                          {item.available_today && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">Available Today</span>
                          )}
                          {item.telehealth && (
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-md">Telehealth</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-ds-border">
                          <span className="text-sm text-ds-muted-foreground">{item.next_available || "Contact for availability"}</span>
                          <span className="text-sm text-ds-primary font-medium group-hover:underline">Book Now</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                    <span className="text-sm text-ds-muted-foreground">Page {page} of {totalPages}</span>
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
