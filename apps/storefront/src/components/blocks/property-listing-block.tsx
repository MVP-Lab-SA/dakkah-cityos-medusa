import React, { useState } from 'react'

interface PropertyListingBlockProps {
  heading?: string
  propertyType?: string
  layout?: 'grid' | 'list' | 'map'
  filters?: boolean
  showMap?: boolean
}

interface Property {
  id: string
  title: string
  image: string
  price: string
  beds: number
  baths: number
  sqft: number
  location: string
  type: string
}

const placeholderProperties: Property[] = [
  { id: '1', title: 'Modern Downtown Apartment', image: '', price: '$2,500/mo', beds: 2, baths: 2, sqft: 1200, location: 'Downtown, City Center', type: 'Apartment' },
  { id: '2', title: 'Suburban Family Home', image: '', price: '$450,000', beds: 4, baths: 3, sqft: 2800, location: 'Oak Park, Westside', type: 'House' },
  { id: '3', title: 'Luxury Penthouse Suite', image: '', price: '$1,200,000', beds: 3, baths: 3, sqft: 3500, location: 'Skyline Tower, Marina', type: 'Penthouse' },
  { id: '4', title: 'Cozy Studio Loft', image: '', price: '$1,800/mo', beds: 1, baths: 1, sqft: 650, location: 'Arts District', type: 'Studio' },
  { id: '5', title: 'Waterfront Villa', image: '', price: '$890,000', beds: 5, baths: 4, sqft: 4200, location: 'Lakeside Drive', type: 'Villa' },
  { id: '6', title: 'Urban Townhouse', image: '', price: '$3,200/mo', beds: 3, baths: 2, sqft: 1800, location: 'Midtown East', type: 'Townhouse' },
]

export const PropertyListingBlock: React.FC<PropertyListingBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading = 'Property Listings',
  propertyType,
  layout: initialLayout = 'grid',
  filters = true,
  showMap = false,
}) => {
  const [activeLayout, setActiveLayout] = useState(initialLayout)
  const [selectedType, setSelectedType] = useState(propertyType || 'All')

  const propertyTypes = ['All', 'Apartment', 'House', 'Penthouse', 'Studio', 'Villa', 'Townhouse']

  const filteredProperties = selectedType === 'All'
    ? placeholderProperties
    : placeholderProperties.filter((p) => p.type === selectedType)

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-ds-muted animate-pulse" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-ds-muted text-ds-muted-foreground">{property.type}</span>
          <span className="text-lg font-bold text-ds-foreground">{property.price}</span>
        </div>
        <h3 className="font-semibold text-ds-foreground mb-2">{property.title}</h3>
        <div className="flex items-center gap-3 text-sm text-ds-muted-foreground mb-2">
          <span>{property.beds} bed</span>
          <span>·</span>
          <span>{property.baths} bath</span>
          <span>·</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>
        <p className="text-sm text-ds-muted-foreground">{property.location}</p>
      </div>
    </div>
  )

  const PropertyListItem = ({ property }: { property: Property }) => (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex">
      <div className="w-48 md:w-64 bg-ds-muted animate-pulse flex-shrink-0" />
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-ds-muted text-ds-muted-foreground">{property.type}</span>
          <span className="text-xl font-bold text-ds-foreground">{property.price}</span>
        </div>
        <h3 className="font-semibold text-ds-foreground text-lg mb-2">{property.title}</h3>
        <div className="flex items-center gap-4 text-sm text-ds-muted-foreground mb-2">
          <span>{property.beds} bed</span>
          <span>·</span>
          <span>{property.baths} bath</span>
          <span>·</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>
        <p className="text-sm text-ds-muted-foreground">{property.location}</p>
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

        {filters && (
          <div className="flex flex-wrap gap-2 mb-8">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-ds-primary text-ds-primary-foreground'
                    : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          <div className="flex-1">
            {activeLayout === 'list' ? (
              <div className="flex flex-col gap-4">
                {filteredProperties.map((property) => (
                  <PropertyListItem key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>

          {showMap && (
            <div className="hidden lg:block w-96 flex-shrink-0">
              <div className="bg-ds-muted rounded-lg h-[600px] flex items-center justify-center sticky top-4">
                <p className="text-ds-muted-foreground text-sm">Map View</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
