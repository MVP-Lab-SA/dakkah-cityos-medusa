import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/freelance/")({
  component: FreelancePage,
})

function FreelancePage() {
  const { tenant, locale } = Route.useParams()
  const [gigs, setGigs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/freelance")
      .then((res) => res.json())
      .then((data) => {
        setGigs(data.freelancers || data.gigs || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Freelance Services</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Find skilled freelancers for your projects. Browse gigs across design, development, writing, marketing, and more.
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
        ) : gigs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </div>
            <p className="text-zinc-500">No freelance gigs available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <FreelanceCard key={gig.id} gig={gig} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FreelanceCard({ gig, tenant, locale }: { gig: any; tenant: string; locale: string }) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "text-amber-400" : "text-zinc-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
      </svg>
    ))
  }

  return (
    <Link
      to={`/${tenant}/${locale}/freelance/${gig.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex-shrink-0 overflow-hidden">
            {(gig.avatar || gig.photo || gig.image) ? (
              <img
                src={gig.avatar || gig.photo || gig.image}
                alt={gig.freelancer_name || gig.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 font-semibold text-lg">
                {(gig.freelancer_name || gig.name || "?").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-zinc-900 text-lg leading-tight">{gig.title || gig.name}</h3>
            {(gig.freelancer_name || gig.freelancer) && (
              <p className="text-sm text-zinc-500 mt-0.5">{gig.freelancer_name || gig.freelancer}</p>
            )}
          </div>
        </div>

        {gig.rating != null && (
          <div className="flex items-center gap-1.5 mt-3">
            <div className="flex">{renderStars(gig.rating)}</div>
            <span className="text-sm text-zinc-500">{Number(gig.rating).toFixed(1)}</span>
          </div>
        )}

        {gig.skills && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(Array.isArray(gig.skills) ? gig.skills.slice(0, 4) : [gig.skills]).map((skill: any, i: number) => (
              <span key={i} className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                {skill}
              </span>
            ))}
          </div>
        )}

        {(gig.rate || gig.hourly_rate || gig.price) != null && (
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-lg font-bold text-zinc-900">
              ${gig.rate || gig.hourly_rate || gig.price}
            </span>
            <span className="text-sm text-zinc-500">{gig.rate_type || "per hour"}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
