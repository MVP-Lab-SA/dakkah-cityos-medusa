import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { Map, CurrencyDollar, Calendar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type TravelPackage = {
  id: string
  destination: string
  duration: string
  price: number
  bookings: number
  status: string
  category: string
  rating: number
  departure_date: string
}

const mockPackages: TravelPackage[] = [
  { id: "trv_01", destination: "Bali, Indonesia", duration: "7 nights", price: 1299, bookings: 45, status: "active", category: "Beach & Resort", rating: 4.8, departure_date: "2026-03-15" },
  { id: "trv_02", destination: "Paris, France", duration: "5 nights", price: 1899, bookings: 32, status: "active", category: "City & Culture", rating: 4.9, departure_date: "2026-04-01" },
  { id: "trv_03", destination: "Tokyo, Japan", duration: "10 nights", price: 2450, bookings: 28, status: "active", category: "Adventure", rating: 4.7, departure_date: "2026-03-20" },
  { id: "trv_04", destination: "Machu Picchu, Peru", duration: "8 nights", price: 1750, bookings: 18, status: "active", category: "Adventure", rating: 4.6, departure_date: "2026-05-10" },
  { id: "trv_05", destination: "Santorini, Greece", duration: "6 nights", price: 1650, bookings: 52, status: "active", category: "Beach & Resort", rating: 4.9, departure_date: "2026-06-01" },
  { id: "trv_06", destination: "Safari, Kenya", duration: "9 nights", price: 3200, bookings: 12, status: "active", category: "Wildlife", rating: 4.8, departure_date: "2026-04-15" },
  { id: "trv_07", destination: "New York, USA", duration: "4 nights", price: 1100, bookings: 67, status: "sold_out", category: "City & Culture", rating: 4.5, departure_date: "2026-03-01" },
  { id: "trv_08", destination: "Maldives", duration: "5 nights", price: 2800, bookings: 22, status: "draft", category: "Luxury", rating: 0, departure_date: "2026-07-01" },
]

const TravelPage = () => {
  const packages = mockPackages
  const totalBookings = packages.reduce((s, p) => s + p.bookings, 0)
  const totalRevenue = packages.reduce((s, p) => s + (p.price * p.bookings), 0)
  const uniqueDestinations = new Set(packages.map(p => p.destination)).size

  const stats = [
    { label: "Total Packages", value: packages.length, icon: <Map className="w-5 h-5" /> },
    { label: "Bookings This Month", value: totalBookings, icon: <Calendar className="w-5 h-5" />, color: "blue" as const },
    { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
    { label: "Destinations", value: uniqueDestinations, color: "purple" as const },
  ]

  const columns = [
    { key: "destination", header: "Destination", sortable: true, cell: (p: TravelPackage) => (
      <div><Text className="font-medium">{p.destination}</Text><Text className="text-ui-fg-muted text-sm">{p.category}</Text></div>
    )},
    { key: "duration", header: "Duration", cell: (p: TravelPackage) => p.duration },
    { key: "price", header: "Price", sortable: true, cell: (p: TravelPackage) => <Text className="font-medium">${p.price.toLocaleString()}</Text> },
    { key: "departure_date", header: "Departure", sortable: true, cell: (p: TravelPackage) => p.departure_date },
    { key: "bookings", header: "Bookings", sortable: true, cell: (p: TravelPackage) => p.bookings },
    { key: "status", header: "Status", cell: (p: TravelPackage) => <StatusBadge status={p.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Travel Packages</Heading><Text className="text-ui-fg-muted">Manage travel packages, bookings, and destinations</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={packages} columns={columns} searchable searchPlaceholder="Search packages..." searchKeys={["destination", "category"]} loading={false} emptyMessage="No packages found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Travel", icon: Map })
export default TravelPage
