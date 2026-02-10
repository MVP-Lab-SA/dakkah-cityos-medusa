import { Clock, Users, ArrowRight } from "@medusajs/icons"
import type { Service } from "../../lib/types/bookings"
import { useTenantPrefix } from "@/lib/context/tenant-context"

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const prefix = useTenantPrefix()
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <a
      href={`${prefix}/bookings/${service.handle}`}
      className="group enterprise-card overflow-hidden hover:border-slate-300 block"
    >
      {/* Image */}
      {service.images && service.images[0] && (
        <div className="aspect-[16/9] overflow-hidden bg-slate-100">
          <img
            src={service.images[0].url}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            {formatDuration(service.duration)}
          </div>
          {service.capacity && service.capacity > 1 && (
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              Up to {service.capacity}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xl font-bold text-slate-900">
            {formatPrice(service.price, service.currency_code)}
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
            Book Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </a>
  )
}

interface ServiceListProps {
  services: Service[]
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="empty-state">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="empty-state-title">No services available</h3>
        <p className="empty-state-description">
          Check back later for available services.
        </p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
        />
      ))}
    </div>
  )
}
