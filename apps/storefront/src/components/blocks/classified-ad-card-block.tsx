import React, { useState } from 'react'

interface ClassifiedAd {
  id: string
  title: string
  price: string
  location: string
  postedDate: string
  category: string
  featured?: boolean
  description?: string
}

interface ClassifiedAdCardBlockProps {
  heading?: string
  category?: string
  layout?: 'grid' | 'list' | 'map'
  showContactInfo?: boolean
  showPrice?: boolean
}

const placeholderAds: ClassifiedAd[] = [
  { id: '1', title: 'Vintage Leather Sofa', price: '$450', location: 'Downtown', postedDate: '2 hours ago', category: 'Furniture', featured: true, description: 'Excellent condition, genuine leather' },
  { id: '2', title: 'Mountain Bike - Trek', price: '$800', location: 'Westside', postedDate: '5 hours ago', category: 'Sports', description: '2023 model, barely used' },
  { id: '3', title: '2BR Apartment for Rent', price: '$1,500/mo', location: 'Midtown', postedDate: '1 day ago', category: 'Housing', featured: true, description: 'Spacious, natural light' },
  { id: '4', title: 'iPhone 15 Pro Max', price: '$900', location: 'East End', postedDate: '3 hours ago', category: 'Electronics', description: '256GB, like new with case' },
  { id: '5', title: 'Guitar Lessons', price: '$40/hr', location: 'Arts District', postedDate: '1 day ago', category: 'Services', description: 'Experienced instructor, all levels' },
  { id: '6', title: 'Labrador Puppies', price: '$500', location: 'Suburbs', postedDate: '6 hours ago', category: 'Pets', description: 'AKC registered, vaccinated' },
  { id: '7', title: 'Standing Desk - Uplift', price: '$350', location: 'Northside', postedDate: '2 days ago', category: 'Furniture', description: 'Electric sit/stand, bamboo top' },
  { id: '8', title: 'Moving Sale - Everything Must Go', price: 'Various', location: 'South Bay', postedDate: '4 hours ago', category: 'General', featured: true, description: 'Household items, tools, clothing' },
]

const categories = ['All', 'Furniture', 'Electronics', 'Housing', 'Sports', 'Services', 'Pets', 'General']

export const ClassifiedAdCardBlock: React.FC<ClassifiedAdCardBlockProps> = ({
  heading = 'Classifieds',
  category: initialCategory,
  layout: initialLayout = 'grid',
  showContactInfo = true,
  showPrice = true,
}) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All')
  const [activeLayout, setActiveLayout] = useState(initialLayout)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  const filteredAds = activeCategory === 'All'
    ? placeholderAds
    : placeholderAds.filter((ad) => ad.category === activeCategory)

  const AdCard = ({ ad }: { ad: ClassifiedAd }) => (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden hover:shadow-md transition-shadow relative">
      {ad.featured && (
        <div className="absolute top-2 left-2 z-10">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-ds-primary text-ds-primary-foreground">Featured</span>
        </div>
      )}
      <button
        onClick={() => toggleFavorite(ad.id)}
        className="absolute top-2 right-2 z-10 text-lg hover:scale-110 transition-transform"
      >
        {favoriteIds.includes(ad.id) ? '❤️' : '🤍'}
      </button>
      <div className="aspect-video bg-ds-muted animate-pulse" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-ds-muted-foreground">{ad.category}</span>
          <span className="text-xs text-ds-muted-foreground">{ad.postedDate}</span>
        </div>
        <h3 className="font-semibold text-ds-foreground mb-1">{ad.title}</h3>
        {ad.description && (
          <p className="text-sm text-ds-muted-foreground mb-2 line-clamp-2">{ad.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            {showPrice && <p className="font-bold text-ds-foreground">{ad.price}</p>}
            <p className="text-xs text-ds-muted-foreground">{ad.location}</p>
          </div>
          {showContactInfo && (
            <button className="px-3 py-1.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Contact
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const AdListItem = ({ ad }: { ad: ClassifiedAd }) => (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex">
      <div className="w-40 md:w-56 bg-ds-muted animate-pulse flex-shrink-0 relative">
        {ad.featured && (
          <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full bg-ds-primary text-ds-primary-foreground">Featured</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-ds-muted-foreground">{ad.category} · {ad.postedDate}</span>
            <button onClick={() => toggleFavorite(ad.id)} className="text-lg hover:scale-110 transition-transform">
              {favoriteIds.includes(ad.id) ? '❤️' : '🤍'}
            </button>
          </div>
          <h3 className="font-semibold text-ds-foreground text-lg mb-1">{ad.title}</h3>
          {ad.description && (
            <p className="text-sm text-ds-muted-foreground mb-2">{ad.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showPrice && <span className="font-bold text-ds-foreground">{ad.price}</span>}
            <span className="text-sm text-ds-muted-foreground">{ad.location}</span>
          </div>
          {showContactInfo && (
            <button className="px-4 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Contact
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground">{heading}</h2>
          <div className="flex items-center gap-2">
            {(['grid', 'list'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setActiveLayout(l)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeLayout === l
                    ? 'bg-ds-primary text-ds-primary-foreground'
                    : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
                }`}
              >
                {l === 'grid' ? 'Grid' : 'List'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-ds-primary text-ds-primary-foreground'
                  : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {activeLayout === 'list' ? (
          <div className="flex flex-col gap-4">
            {filteredAds.map((ad) => (
              <AdListItem key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}

        {filteredAds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ds-muted-foreground">No listings found in this category</p>
          </div>
        )}
      </div>
    </section>
  )
}
