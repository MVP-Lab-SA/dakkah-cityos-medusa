import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { ReceiptPercent, CurrencyDollar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Rental = {
  id: string
  item: string
  category: string
  renter: string
  renter_email: string
  start_date: string
  end_date: string
  daily_rate: number
  total: number
  status: string
}

const mockRentals: Rental[] = [
  { id: "rnt_01", item: "Canon EOS R5 Camera Kit", category: "Electronics", renter: "Sarah Chen", renter_email: "sarah@example.com", start_date: "2026-02-10", end_date: "2026-02-17", daily_rate: 85, total: 595, status: "active" },
  { id: "rnt_02", item: "Mountain Bike - Trek Fuel EX", category: "Sports", renter: "James Wilson", renter_email: "james@example.com", start_date: "2026-02-12", end_date: "2026-02-14", daily_rate: 45, total: 90, status: "active" },
  { id: "rnt_03", item: "DJI Mavic 3 Pro Drone", category: "Electronics", renter: "Mike Torres", renter_email: "mike@example.com", start_date: "2026-02-08", end_date: "2026-02-10", daily_rate: 120, total: 240, status: "returned" },
  { id: "rnt_04", item: "Camping Set - 4 Person", category: "Outdoors", renter: "Emily Brown", renter_email: "emily@example.com", start_date: "2026-02-15", end_date: "2026-02-20", daily_rate: 35, total: 175, status: "reserved" },
  { id: "rnt_05", item: "Sony A7 IV + Lenses Bundle", category: "Electronics", renter: "David Lee", renter_email: "david@example.com", start_date: "2026-02-05", end_date: "2026-02-12", daily_rate: 95, total: 665, status: "overdue" },
  { id: "rnt_06", item: "Kayak - Tandem Sea Eagle", category: "Water Sports", renter: "Lisa Park", renter_email: "lisa@example.com", start_date: "2026-02-13", end_date: "2026-02-13", daily_rate: 60, total: 60, status: "active" },
  { id: "rnt_07", item: "Power Tools Set - DeWalt", category: "Tools", renter: "Robert Garcia", renter_email: "robert@example.com", start_date: "2026-02-01", end_date: "2026-02-07", daily_rate: 40, total: 280, status: "returned" },
  { id: "rnt_08", item: "Ski Equipment Package", category: "Sports", renter: "Anna Schmidt", renter_email: "anna@example.com", start_date: "2026-02-14", end_date: "2026-02-21", daily_rate: 55, total: 385, status: "reserved" },
]

const RentalsPage = () => {
  const rentals = mockRentals
  const currentlyRented = rentals.filter(r => r.status === "active" || r.status === "overdue").length
  const available = rentals.filter(r => r.status === "returned").length
  const revenue = rentals.reduce((s, r) => s + r.total, 0)

  const stats = [
    { label: "Total Rental Items", value: rentals.length, icon: <ReceiptPercent className="w-5 h-5" /> },
    { label: "Currently Rented", value: currentlyRented, color: "blue" as const },
    { label: "Available", value: available, color: "green" as const },
    { label: "Revenue", value: `$${revenue.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
  ]

  const columns = [
    { key: "item", header: "Item", sortable: true, cell: (r: Rental) => (
      <div><Text className="font-medium">{r.item}</Text><Text className="text-ui-fg-muted text-sm">{r.category}</Text></div>
    )},
    { key: "renter", header: "Renter", cell: (r: Rental) => (
      <div><Text className="font-medium">{r.renter}</Text><Text className="text-ui-fg-muted text-sm">{r.renter_email}</Text></div>
    )},
    { key: "dates", header: "Dates", cell: (r: Rental) => (
      <div><Text className="text-sm">{r.start_date}</Text><Text className="text-ui-fg-muted text-sm">to {r.end_date}</Text></div>
    )},
    { key: "daily_rate", header: "Rate", sortable: true, cell: (r: Rental) => `$${r.daily_rate}/day` },
    { key: "total", header: "Total", sortable: true, cell: (r: Rental) => <Text className="font-medium">${r.total.toLocaleString()}</Text> },
    { key: "status", header: "Status", cell: (r: Rental) => <StatusBadge status={r.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Rental Management</Heading><Text className="text-ui-fg-muted">Manage rental items, bookings, and returns</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={rentals} columns={columns} searchable searchPlaceholder="Search rentals..." searchKeys={["item", "renter", "category"]} loading={false} emptyMessage="No rentals found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Rentals", icon: ReceiptPercent })
export default RentalsPage
