import React from 'react'

interface ServiceItem {
  name: string
  description?: string
  price?: number
  duration?: string
  image?: string
  category?: string
}

interface ServiceCardGridBlockProps {
  heading?: string
  services?: ServiceItem[]
  columns?: 2 | 3 | 4
  showBookingCta?: boolean
  categoryFilter?: boolean
}

const defaultServices: ServiceItem[] = [
  { name: 'Deep Tissue Massage', description: 'Targeted deep pressure to relieve chronic muscle tension.', price: 120, duration: '60 min', image: '', category: 'Massage' },
  { name: 'Swedish Massage', description: 'Gentle full-body massage for relaxation and stress relief.', price: 90, duration: '60 min', image: '', category: 'Massage' },
  { name: 'Classic Facial', description: 'Cleansing, exfoliation, and hydration for glowing skin.', price: 85, duration: '45 min', image: '', category: 'Facial' },
  { name: 'Hair Cut & Style', description: 'Professional haircut with blow-dry styling.', price: 55, duration: '30 min', image: '', category: 'Hair' },
  { name: 'Manicure & Pedicure', description: 'Complete nail care for hands and feet.', price: 65, duration: '75 min', image: '', category: 'Nails' },
  { name: 'Hot Stone Therapy', description: 'Heated stones placed on key points to ease tension.', price: 140, duration: '90 min', image: '', category: 'Massage' },
]

const columnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export const ServiceCardGridBlock: React.FC<ServiceCardGridBlockProps> = ({
  heading = 'Our Services',
  services,
  columns = 3,
  showBookingCta = true,
  categoryFilter = true,
}) => {
  const items = services && services.length > 0 ? services : defaultServices
  const categories = React.useMemo(() => {
    const cats = new Set<string>()
    items.forEach((s) => { if (s.category) cats.add(s.category) })
    return ['All', ...Array.from(cats)]
  }, [items])

  const [activeCategory, setActiveCategory] = React.useState('All')

  const filtered = activeCategory === 'All' ? items : items.filter((s) => s.category === activeCategory)

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground text-center mb-8">
            {heading}
          </h2>
        )}

        {categoryFilter && categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-ds-primary text-ds-primary-foreground'
                    : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className={`grid gap-6 ${columnClasses[columns]}`}>
          {filtered.map((service, index) => (
            <div
              key={index}
              className="rounded-xl border border-ds-border bg-ds-card overflow-hidden transition-shadow hover:shadow-lg"
            >
              {service.image ? (
                <div className="aspect-video bg-ds-muted overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-ds-muted flex items-center justify-center">
                  <svg className="w-12 h-12 text-ds-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              <div className="p-5">
                <h3 className="text-lg font-semibold text-ds-foreground mb-1">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-ds-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                )}

                <div className="flex items-center gap-3 mb-4">
                  {service.price !== undefined && (
                    <span className="text-lg font-bold text-ds-primary">${service.price}</span>
                  )}
                  {service.duration && (
                    <span className="text-sm text-ds-muted-foreground flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {service.duration}
                    </span>
                  )}
                </div>

                {showBookingCta && (
                  <button className="w-full py-2.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                    Book Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
