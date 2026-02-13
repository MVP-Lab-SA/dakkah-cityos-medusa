import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Heart, CurrencyDollar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type PetService = {
  id: string
  name: string
  type: string
  provider: string
  provider_email: string
  price: number
  duration: string
  bookings: number
  rating: number
  status: string
}

const mockServices: PetService[] = [
  { id: "pet_01", name: "Full Grooming Package - Dogs", type: "Grooming", provider: "Pampered Paws Salon", provider_email: "info@pamperedpaws.com", price: 85, duration: "2 hours", bookings: 124, rating: 4.8, status: "active" },
  { id: "pet_02", name: "Cat Boarding - Premium Suite", type: "Boarding", provider: "Whiskers Inn", provider_email: "stay@whiskersinn.com", price: 55, duration: "Per night", bookings: 89, rating: 4.6, status: "active" },
  { id: "pet_03", name: "Dog Walking - Group (1hr)", type: "Walking", provider: "Happy Tails Walking", provider_email: "walk@happytails.co", price: 25, duration: "1 hour", bookings: 342, rating: 4.9, status: "active" },
  { id: "pet_04", name: "Veterinary Checkup", type: "Veterinary", provider: "PetCare Clinic", provider_email: "clinic@petcare.com", price: 120, duration: "30 min", bookings: 56, rating: 4.7, status: "active" },
  { id: "pet_05", name: "Puppy Training - 6 Week Course", type: "Training", provider: "K9 Academy", provider_email: "train@k9academy.com", price: 350, duration: "6 weeks", bookings: 18, rating: 4.5, status: "active" },
  { id: "pet_06", name: "Pet Sitting (In-Home)", type: "Sitting", provider: "Furry Friends Sitting", provider_email: "sit@furryfriends.co", price: 45, duration: "Per day", bookings: 67, rating: 4.8, status: "active" },
  { id: "pet_07", name: "Exotic Pet Care Consultation", type: "Veterinary", provider: "Exotic Animal Clinic", provider_email: "exotic@animalclinic.com", price: 200, duration: "45 min", bookings: 12, rating: 4.4, status: "inactive" },
  { id: "pet_08", name: "Pet Photography Session", type: "Photography", provider: "PawPrints Studio", provider_email: "photo@pawprints.com", price: 150, duration: "1 hour", bookings: 34, rating: 4.9, status: "active" },
]

const PetServicesPage = () => {
  const services = mockServices
  const activeBookings = 47
  const providers = [...new Set(services.map(s => s.provider))].length
  const revenue = services.reduce((s, svc) => s + (svc.price * svc.bookings), 0)

  const stats = [
    { label: "Total Services", value: services.length, icon: <Heart className="w-5 h-5" /> },
    { label: "Active Bookings", value: activeBookings, color: "blue" as const },
    { label: "Providers", value: providers, color: "green" as const },
    { label: "Revenue", value: `$${revenue.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
  ]

  const columns = [
    { key: "name", header: "Service", sortable: true, cell: (s: PetService) => (
      <div><Text className="font-medium">{s.name}</Text><Text className="text-ui-fg-muted text-sm">{s.duration}</Text></div>
    )},
    { key: "type", header: "Type", cell: (s: PetService) => <Badge color="grey">{s.type}</Badge> },
    { key: "provider", header: "Provider", cell: (s: PetService) => (
      <div><Text className="font-medium">{s.provider}</Text><Text className="text-ui-fg-muted text-sm">{s.provider_email}</Text></div>
    )},
    { key: "price", header: "Price", sortable: true, cell: (s: PetService) => <Text className="font-medium">${s.price}</Text> },
    { key: "bookings", header: "Bookings", sortable: true, cell: (s: PetService) => (
      <div><Text className="font-medium">{s.bookings}</Text><Text className="text-ui-fg-muted text-sm">⭐ {s.rating}</Text></div>
    )},
    { key: "status", header: "Status", cell: (s: PetService) => <StatusBadge status={s.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Pet Services</Heading><Text className="text-ui-fg-muted">Manage pet care services, providers, and bookings</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={services} columns={columns} searchable searchPlaceholder="Search services..." searchKeys={["name", "provider", "type"]} loading={false} emptyMessage="No pet services found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Pet Services", icon: Heart })
export default PetServicesPage
