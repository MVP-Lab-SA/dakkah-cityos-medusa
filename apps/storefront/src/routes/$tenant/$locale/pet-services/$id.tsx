// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/pet-services/$id")({
  component: PetServiceDetailPage,
})

function PetServiceDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const prefix = `/${tenant}/${locale}`

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["pet-services", id],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ item: any }>(
        `/store/pet-services/${id}`,
        { method: "GET", credentials: "include" }
      )
      return response.item || response
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-6 w-48 bg-ds-muted rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-[16/9] bg-ds-muted rounded-xl animate-pulse" />
              <div className="h-8 w-3/4 bg-ds-muted rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-ds-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-ds-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-ds-muted rounded-xl animate-pulse" />
              <div className="h-48 bg-ds-muted rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-ds-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-ds-foreground mb-2">Service Not Found</h2>
            <p className="text-ds-muted-foreground mb-6">This pet service may have been removed or is no longer available.</p>
            <Link to={`${prefix}/pet-services` as any} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:bg-ds-primary/90 transition-colors">
              Browse Pet Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const typeLabels: Record<string, string> = {
    grooming: "Grooming",
    boarding: "Boarding",
    vet: "Veterinary",
    training: "Training",
    walking: "Dog Walking",
    sitting: "Pet Sitting",
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`${prefix}/pet-services` as any} className="hover:text-ds-foreground transition-colors">Pet Services</Link>
            <span>/</span>
            <span className="text-ds-foreground truncate">{service.name || service.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/9] bg-ds-muted rounded-xl overflow-hidden">
              {service.thumbnail || service.image ? (
                <img src={service.thumbnail || service.image} alt={service.name || service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-ds-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {service.type && (
                <span className="absolute top-4 start-4 px-3 py-1 text-xs font-semibold rounded-full bg-ds-primary text-ds-primary-foreground">{typeLabels[service.type] || service.type}</span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ds-foreground">{service.name || service.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {service.provider && (
                  <div className="flex items-center gap-1.5 text-sm text-ds-muted-foreground">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span>{typeof service.provider === "string" ? service.provider : service.provider.name}</span>
                  </div>
                )}
                {service.rating && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span className="text-sm font-medium text-ds-foreground">{service.rating}</span>
                    {service.review_count && <span className="text-sm text-ds-muted-foreground">({service.review_count} reviews)</span>}
                  </div>
                )}
                {service.location && (
                  <div className="flex items-center gap-1.5 text-sm text-ds-muted-foreground">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{service.location}</span>
                  </div>
                )}
              </div>
            </div>

            {service.description && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">About This Service</h2>
                <p className="text-ds-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{service.description}</p>
              </div>
            )}

            {service.packages && service.packages.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-4">Service Packages</h2>
                <div className="space-y-3">
                  {service.packages.map((pkg: any, idx: number) => (
                    <div key={idx} className="p-4 border border-ds-border rounded-lg hover:border-ds-primary transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-ds-foreground">{typeof pkg === "string" ? pkg : pkg.name}</p>
                          {pkg.description && <p className="text-xs text-ds-muted-foreground mt-1">{pkg.description}</p>}
                          {pkg.duration && <p className="text-xs text-ds-muted-foreground mt-0.5">Duration: {pkg.duration}</p>}
                        </div>
                        {pkg.price != null && <p className="font-bold text-ds-primary">${Number(pkg.price).toLocaleString()}</p>}
                      </div>
                      {pkg.includes && pkg.includes.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {pkg.includes.map((item: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-ds-muted-foreground">
                              <svg className="w-3 h-3 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.pet_types && service.pet_types.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-3">Accepted Pets</h2>
                <div className="flex flex-wrap gap-2">
                  {service.pet_types.map((pet: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 text-xs font-medium rounded-full bg-ds-muted text-ds-muted-foreground">{pet}</span>
                  ))}
                </div>
              </div>
            )}

            {service.reviews && service.reviews.length > 0 && (
              <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                <h2 className="font-semibold text-ds-foreground mb-4">Reviews</h2>
                <div className="space-y-4">
                  {service.reviews.map((review: any, idx: number) => (
                    <div key={idx} className="pb-4 border-b border-ds-border last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`w-4 h-4 ${star <= (review.rating || 0) ? "text-yellow-500" : "text-ds-muted"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-ds-foreground">{review.author}</span>
                      </div>
                      <p className="text-sm text-ds-muted-foreground">{review.comment || review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="sticky top-4 space-y-6">
              <div className="bg-ds-background border border-ds-border rounded-xl p-6 space-y-4">
                {service.price_range && (
                  <div className="text-center">
                    <p className="text-3xl font-bold text-ds-foreground">{service.price_range}</p>
                    <p className="text-sm text-ds-muted-foreground">Price Range</p>
                  </div>
                )}
                {service.price != null && !service.price_range && (
                  <div className="text-center">
                    <p className="text-3xl font-bold text-ds-foreground">${Number(service.price).toLocaleString()}</p>
                  </div>
                )}

                <button className="w-full py-3 px-4 bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Book Appointment
                </button>

                <button className="w-full py-3 px-4 border border-ds-border text-ds-foreground rounded-lg font-medium hover:bg-ds-muted transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Contact Provider
                </button>
              </div>

              {service.availability && (
                <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                  <h3 className="font-semibold text-ds-foreground mb-3">Availability</h3>
                  {Array.isArray(service.availability) ? (
                    <div className="space-y-2">
                      {service.availability.map((slot: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 text-sm">
                          <span className="text-ds-foreground">{typeof slot === "string" ? slot : slot.day}</span>
                          {slot.hours && <span className="text-ds-muted-foreground">{slot.hours}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-ds-muted-foreground">{service.availability}</p>
                  )}
                </div>
              )}

              {service.certifications && service.certifications.length > 0 && (
                <div className="bg-ds-background border border-ds-border rounded-xl p-6">
                  <h3 className="font-semibold text-ds-foreground mb-3">Certifications</h3>
                  <div className="space-y-2">
                    {service.certifications.map((cert: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-ds-muted-foreground">
                        <svg className="w-4 h-4 text-ds-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        {typeof cert === "string" ? cert : cert.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
