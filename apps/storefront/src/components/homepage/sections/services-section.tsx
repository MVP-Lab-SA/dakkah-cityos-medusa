import { Link } from "@tanstack/react-router"
import { Clock, MapPin } from "@medusajs/icons"

interface Service {
  id: string
  name: string
  handle: string
  description?: string
  duration?: number // in minutes
  price?: number
  currency_code?: string
  image?: string
}

interface ServicesSectionProps {
  countryCode: string
  services: Service[]
  config: Record<string, any>
}

export function ServicesSection({ countryCode, services, config }: ServicesSectionProps) {
  if (services.length === 0) return null

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {config.title || "Book a Service"}
            </h2>
            <p className="mt-2 text-gray-600">
              {config.subtitle || "Professional services available for booking"}
            </p>
          </div>
          <Link
            to={`/${countryCode}/bookings` as any}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            View All Services
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(service => (
            <Link
              key={service.id}
              to={`/${countryCode}/bookings/${service.handle}` as any}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {service.image ? (
                <div className="aspect-video">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <Clock className="h-12 w-12 text-gray-300" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-600">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {service.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  {service.duration && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(service.duration)}
                    </div>
                  )}
                  {service.price !== undefined && service.currency_code && (
                    <span className="font-medium text-gray-900">
                      {formatPrice(service.price, service.currency_code)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
