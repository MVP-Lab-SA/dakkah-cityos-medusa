import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/real-estate/")({
  component: RealEstatePage,
})

function RealEstatePage() {
  const { tenant, locale } = Route.useParams()
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/real-estate")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data.properties || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Real Estate Listings</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Discover your dream property. Browse homes, apartments, and commercial spaces in prime locations.
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
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <p className="text-zinc-500">No properties available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PropertyCard({ property, tenant, locale }: { property: any; tenant: string; locale: string }) {
  return (
    <Link
      to={`/${tenant}/${locale}/real-estate/${property.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-zinc-100 relative">
        {(property.photo || property.thumbnail || property.image) ? (
          <img
            src={property.photo || property.thumbnail || property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
        )}
        {property.status && (
          <span className="absolute top-3 left-3 bg-zinc-900 text-white text-xs px-2 py-1 rounded">
            {property.status}
          </span>
        )}
      </div>
      <div className="p-5">
        {property.price != null && (
          <p className="text-xl font-bold text-zinc-900">${Number(property.price).toLocaleString()}</p>
        )}
        <h3 className="font-semibold text-zinc-900 mt-1">{property.title}</h3>
        {property.location && (
          <p className="text-sm text-zinc-500 mt-1">{property.location}</p>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
          {property.bedrooms != null && (
            <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
          )}
          {property.bathrooms != null && (
            <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
          )}
          {property.area && (
            <span>{property.area} sq ft</span>
          )}
        </div>
      </div>
    </Link>
  )
}
