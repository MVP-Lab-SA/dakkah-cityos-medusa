import React, { useState } from 'react'

interface ParkingSpot {
  id: string
  name: string
  type: 'covered' | 'open' | 'valet' | 'ev_charging'
  price: string
  distance: string
  available: number
  total: number
}

interface ParkingSpotFinderBlockProps {
  locationId?: string
  showMap?: boolean
  showPricing?: boolean
  filterByType?: boolean
  variant?: 'map' | 'list' | 'hybrid'
}

const placeholderSpots: ParkingSpot[] = [
  { id: '1', name: 'Central Garage - Level 1', type: 'covered', price: '$8/hr', distance: '0.1 mi', available: 23, total: 50 },
  { id: '2', name: 'Main Street Lot', type: 'open', price: '$5/hr', distance: '0.2 mi', available: 8, total: 30 },
  { id: '3', name: 'Premium Valet - Grand Hotel', type: 'valet', price: '$25/visit', distance: '0.3 mi', available: 5, total: 15 },
  { id: '4', name: 'EV Station - Tech Park', type: 'ev_charging', price: '$12/hr', distance: '0.4 mi', available: 3, total: 10 },
  { id: '5', name: 'Westside Parking Structure', type: 'covered', price: '$6/hr', distance: '0.5 mi', available: 45, total: 120 },
  { id: '6', name: 'City Center Open Lot', type: 'open', price: '$4/hr', distance: '0.3 mi', available: 15, total: 40 },
  { id: '7', name: 'Airport EV Charging Hub', type: 'ev_charging', price: '$15/hr', distance: '1.2 mi', available: 7, total: 20 },
  { id: '8', name: 'Downtown Valet Service', type: 'valet', price: '$30/visit', distance: '0.1 mi', available: 2, total: 8 },
]

const typeLabels: Record<string, string> = {
  covered: 'Covered',
  open: 'Open',
  valet: 'Valet',
  ev_charging: 'EV Charging',
}

const typeIcons: Record<string, string> = {
  covered: '🏢',
  open: '☀️',
  valet: '🚗',
  ev_charging: '⚡',
}

const typeFilters = ['All', 'covered', 'open', 'valet', 'ev_charging']

export const ParkingSpotFinderBlock: React.FC<ParkingSpotFinderBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  locationId,
  showMap = true,
  showPricing = true,
  filterByType = true,
  variant = 'hybrid',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')

  const filteredSpots = placeholderSpots.filter((spot) => {
    const matchesType = selectedType === 'All' || spot.type === selectedType
    const matchesSearch = !searchQuery || spot.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const SpotCard = ({ spot }: { spot: ParkingSpot }) => {
    const availPercent = Math.round((spot.available / spot.total) * 100)
    return (
      <div className="bg-ds-card border border-ds-border rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeIcons[spot.type]}</span>
            <div>
              <h4 className="font-semibold text-ds-foreground text-sm">{spot.name}</h4>
              <span className="text-xs text-ds-muted-foreground">{typeLabels[spot.type]}</span>
            </div>
          </div>
          {showPricing && (
            <span className="font-bold text-ds-foreground text-sm">{spot.price}</span>
          )}
        </div>
        <div className="flex items-center justify-between mb-2 text-xs text-ds-muted-foreground">
          <span>{spot.distance} away</span>
          <span className={spot.available <= 3 ? 'text-ds-destructive font-medium' : ''}>
            {spot.available} spots available
          </span>
        </div>
        <div className="w-full bg-ds-muted rounded-full h-1.5 mb-3">
          <div
            className={`h-1.5 rounded-full transition-all ${availPercent < 20 ? 'bg-ds-destructive' : availPercent < 50 ? 'bg-ds-warning' : 'bg-ds-primary'}`}
            style={{ width: `${availPercent}%` }}
          />
        </div>
        <button className="w-full px-3 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Reserve Spot
        </button>
      </div>
    )
  }

  const SpotListItem = ({ spot }: { spot: ParkingSpot }) => (
    <div className="bg-ds-card border border-ds-border rounded-lg p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
      <span className="text-2xl">{typeIcons[spot.type]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-ds-foreground">{spot.name}</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-ds-muted text-ds-muted-foreground">{typeLabels[spot.type]}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-ds-muted-foreground mt-1">
          <span>{spot.distance} away</span>
          <span className={spot.available <= 3 ? 'text-ds-destructive font-medium' : ''}>
            {spot.available}/{spot.total} available
          </span>
        </div>
      </div>
      {showPricing && (
        <span className="font-bold text-ds-foreground">{spot.price}</span>
      )}
      <button className="px-4 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0">
        Reserve Spot
      </button>
    </div>
  )

  const MapPlaceholder = () => (
    <div className="bg-ds-muted rounded-lg h-[400px] flex items-center justify-center relative">
      <p className="text-ds-muted-foreground text-sm">Map View</p>
      {filteredSpots.slice(0, 5).map((spot, i) => (
        <div
          key={spot.id}
          className="absolute bg-ds-primary text-ds-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md"
          style={{
            top: `${20 + (i * 15)}%`,
            left: `${15 + (i * 18)}%`,
          }}
        >
          {typeIcons[spot.type]}
        </div>
      ))}
    </div>
  )

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-2">Find Parking</h2>
        <p className="text-ds-muted-foreground mb-6">Search for available parking spots near your destination</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by location or garage name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-ds-border bg-ds-background text-ds-foreground"
            />
          </div>
          {filterByType && (
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {typeFilters.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedType === type
                      ? 'bg-ds-primary text-ds-primary-foreground'
                      : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
                  }`}
                >
                  {type === 'All' ? 'All Types' : `${typeIcons[type]} ${typeLabels[type]}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {variant === 'map' && showMap && (
          <div>
            <MapPlaceholder />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          </div>
        )}

        {variant === 'list' && (
          <div className="space-y-3">
            {filteredSpots.map((spot) => (
              <SpotListItem key={spot.id} spot={spot} />
            ))}
          </div>
        )}

        {variant === 'hybrid' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {showMap && (
              <div className="lg:w-1/2">
                <MapPlaceholder />
              </div>
            )}
            <div className={showMap ? 'lg:w-1/2' : 'w-full'}>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredSpots.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            </div>
          </div>
        )}

        {filteredSpots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ds-muted-foreground">No parking spots found matching your criteria</p>
          </div>
        )}
      </div>
    </section>
  )
}
