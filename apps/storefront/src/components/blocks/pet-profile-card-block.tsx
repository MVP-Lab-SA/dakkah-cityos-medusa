import React from 'react'

interface PetProfileCardBlockProps {
  heading?: string
  showServices?: boolean
  showVetInfo?: boolean
  variant?: 'card' | 'detailed' | 'compact'
}

const placeholderPet = {
  name: 'Buddy',
  breed: 'Golden Retriever',
  age: '3 years',
  weight: '32 kg',
  gender: 'Male',
  owner: 'Jane Smith',
  ownerPhone: '(555) 123-4567',
  vaccinations: [
    { name: 'Rabies', status: 'up-to-date', date: 'Jan 2026' },
    { name: 'DHPP', status: 'up-to-date', date: 'Mar 2025' },
    { name: 'Bordetella', status: 'due-soon', date: 'Apr 2026' },
    { name: 'Lyme', status: 'overdue', date: 'Dec 2024' },
  ],
  appointments: [
    { service: 'Annual Checkup', date: 'Mar 20, 2026', time: '10:00 AM' },
    { service: 'Grooming', date: 'Apr 5, 2026', time: '2:00 PM' },
  ],
  vet: {
    name: 'Dr. Amanda Foster',
    clinic: 'Happy Paws Veterinary',
    phone: '(555) 987-6543',
  },
}

const services = [
  { name: 'Grooming', price: '$45' },
  { name: 'Boarding', price: '$60/night' },
  { name: 'Dog Walking', price: '$25/walk' },
  { name: 'Training Session', price: '$80' },
  { name: 'Pet Sitting', price: '$50/day' },
]

const statusColors: Record<string, string> = {
  'up-to-date': 'bg-ds-success/15 text-ds-success',
  'due-soon': 'bg-ds-warning/15 text-ds-warning',
  'overdue': 'bg-ds-destructive/15 text-ds-destructive',
}

export const PetProfileCardBlock: React.FC<PetProfileCardBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading = 'Pet Profile',
  showServices = true,
  showVetInfo = true,
  variant = 'card',
}) => {
  if (variant === 'compact') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-md">
          <div className="bg-ds-card border border-ds-border rounded-lg p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-ds-muted animate-pulse flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ds-foreground">{placeholderPet.name}</h3>
              <p className="text-sm text-ds-muted-foreground">{placeholderPet.breed} · {placeholderPet.age}</p>
              <p className="text-xs text-ds-muted-foreground">Owner: {placeholderPet.owner}</p>
            </div>
            <button className="px-3 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0">
              Book Service
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'detailed') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-8">{heading}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-ds-card border border-ds-border rounded-lg p-6 text-center">
                <div className="w-32 h-32 rounded-full bg-ds-muted animate-pulse mx-auto mb-4" />
                <h3 className="text-xl font-bold text-ds-foreground">{placeholderPet.name}</h3>
                <p className="text-ds-muted-foreground">{placeholderPet.breed}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-ds-muted rounded-lg p-2">
                    <p className="text-ds-muted-foreground">Age</p>
                    <p className="font-medium text-ds-foreground">{placeholderPet.age}</p>
                  </div>
                  <div className="bg-ds-muted rounded-lg p-2">
                    <p className="text-ds-muted-foreground">Weight</p>
                    <p className="font-medium text-ds-foreground">{placeholderPet.weight}</p>
                  </div>
                  <div className="bg-ds-muted rounded-lg p-2">
                    <p className="text-ds-muted-foreground">Gender</p>
                    <p className="font-medium text-ds-foreground">{placeholderPet.gender}</p>
                  </div>
                  <div className="bg-ds-muted rounded-lg p-2">
                    <p className="text-ds-muted-foreground">Owner</p>
                    <p className="font-medium text-ds-foreground">{placeholderPet.owner}</p>
                  </div>
                </div>
              </div>

              {showVetInfo && (
                <div className="bg-ds-card border border-ds-border rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-ds-foreground mb-2">Veterinarian</h4>
                  <p className="text-sm text-ds-foreground">{placeholderPet.vet.name}</p>
                  <p className="text-xs text-ds-muted-foreground">{placeholderPet.vet.clinic}</p>
                  <p className="text-xs text-ds-muted-foreground">{placeholderPet.vet.phone}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-ds-card border border-ds-border rounded-lg p-6">
                <h4 className="font-semibold text-ds-foreground mb-4">Vaccination Status</h4>
                <div className="space-y-3">
                  {placeholderPet.vaccinations.map((v, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-ds-foreground">{v.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ds-muted-foreground">{v.date}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[v.status]}`}>
                          {v.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-ds-card border border-ds-border rounded-lg p-6">
                <h4 className="font-semibold text-ds-foreground mb-4">Upcoming Appointments</h4>
                <div className="space-y-3">
                  {placeholderPet.appointments.map((apt, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-ds-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-ds-foreground">{apt.service}</p>
                        <p className="text-xs text-ds-muted-foreground">{apt.date} at {apt.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {showServices && (
                <div className="bg-ds-card border border-ds-border rounded-lg p-6">
                  <h4 className="font-semibold text-ds-foreground mb-4">Available Services</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((svc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-ds-border rounded-lg">
                        <span className="text-sm text-ds-foreground">{svc.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-ds-foreground">{svc.price}</span>
                          <button className="text-xs px-2 py-1 bg-ds-primary text-ds-primary-foreground rounded font-medium hover:opacity-90 transition-opacity">
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-lg">
        <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 text-center border-b border-ds-border">
            <div className="w-24 h-24 rounded-full bg-ds-muted animate-pulse mx-auto mb-4" />
            <h3 className="text-xl font-bold text-ds-foreground">{placeholderPet.name}</h3>
            <p className="text-ds-muted-foreground">{placeholderPet.breed} · {placeholderPet.age} · {placeholderPet.weight}</p>
            <p className="text-sm text-ds-muted-foreground mt-1">Owner: {placeholderPet.owner}</p>
          </div>

          <div className="p-6 border-b border-ds-border">
            <h4 className="font-semibold text-ds-foreground mb-3">Vaccinations</h4>
            <div className="flex flex-wrap gap-2">
              {placeholderPet.vaccinations.map((v, i) => (
                <span key={i} className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[v.status]}`}>
                  {v.name}: {v.status.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 border-b border-ds-border">
            <h4 className="font-semibold text-ds-foreground mb-3">Upcoming</h4>
            {placeholderPet.appointments.map((apt, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-sm text-ds-foreground">{apt.service}</span>
                <span className="text-xs text-ds-muted-foreground">{apt.date}</span>
              </div>
            ))}
          </div>

          {showVetInfo && (
            <div className="p-6 border-b border-ds-border">
              <h4 className="font-semibold text-ds-foreground mb-2">Vet Info</h4>
              <p className="text-sm text-ds-foreground">{placeholderPet.vet.name}</p>
              <p className="text-xs text-ds-muted-foreground">{placeholderPet.vet.clinic} · {placeholderPet.vet.phone}</p>
            </div>
          )}

          <div className="p-6">
            <button className="w-full px-6 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Book Service
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
