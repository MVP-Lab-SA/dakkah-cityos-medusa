import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Map, CurrencyDollar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type ParkingSpot = {
  id: string
  zone: string
  spot_number: string
  type: string
  rate_hourly: number
  rate_daily: number
  floor: string
  vehicle: string | null
  license_plate: string | null
  status: string
}

const mockSpots: ParkingSpot[] = [
  { id: "prk_01", zone: "Zone A - Premium", spot_number: "A-101", type: "Covered", rate_hourly: 8, rate_daily: 45, floor: "Level 1", vehicle: "Tesla Model 3", license_plate: "ABC 1234", status: "occupied" },
  { id: "prk_02", zone: "Zone A - Premium", spot_number: "A-102", type: "Covered", rate_hourly: 8, rate_daily: 45, floor: "Level 1", vehicle: null, license_plate: null, status: "available" },
  { id: "prk_03", zone: "Zone B - Standard", spot_number: "B-205", type: "Open", rate_hourly: 4, rate_daily: 25, floor: "Level 2", vehicle: "Honda Civic", license_plate: "XYZ 5678", status: "occupied" },
  { id: "prk_04", zone: "Zone B - Standard", spot_number: "B-210", type: "Open", rate_hourly: 4, rate_daily: 25, floor: "Level 2", vehicle: null, license_plate: null, status: "available" },
  { id: "prk_05", zone: "Zone C - Economy", spot_number: "C-312", type: "Open", rate_hourly: 2, rate_daily: 15, floor: "Level 3", vehicle: "Ford F-150", license_plate: "DEF 9012", status: "occupied" },
  { id: "prk_06", zone: "Zone D - EV Charging", spot_number: "D-401", type: "EV Charger", rate_hourly: 10, rate_daily: 55, floor: "Level 4", vehicle: "BMW iX", license_plate: "EV 3456", status: "occupied" },
  { id: "prk_07", zone: "Zone D - EV Charging", spot_number: "D-402", type: "EV Charger", rate_hourly: 10, rate_daily: 55, floor: "Level 4", vehicle: null, license_plate: null, status: "available" },
  { id: "prk_08", zone: "Zone A - Premium", spot_number: "A-108", type: "Handicap", rate_hourly: 5, rate_daily: 30, floor: "Level 1", vehicle: null, license_plate: null, status: "reserved" },
  { id: "prk_09", zone: "Zone B - Standard", spot_number: "B-220", type: "Open", rate_hourly: 4, rate_daily: 25, floor: "Level 2", vehicle: null, license_plate: null, status: "maintenance" },
  { id: "prk_10", zone: "Zone C - Economy", spot_number: "C-350", type: "Open", rate_hourly: 2, rate_daily: 15, floor: "Level 3", vehicle: "Toyota Camry", license_plate: "GHI 7890", status: "occupied" },
]

const ParkingPage = () => {
  const spots = mockSpots
  const occupied = spots.filter(s => s.status === "occupied").length
  const available = spots.filter(s => s.status === "available").length
  const revenueToday = 1245

  const stats = [
    { label: "Total Spots", value: spots.length, icon: <Map className="w-5 h-5" /> },
    { label: "Occupied", value: occupied, color: "blue" as const },
    { label: "Available", value: available, color: "green" as const },
    { label: "Revenue Today", value: `$${revenueToday.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EV Charger": return "green"
      case "Covered": return "blue"
      case "Handicap": return "purple"
      default: return "grey"
    }
  }

  const columns = [
    { key: "zone", header: "Zone", sortable: true, cell: (s: ParkingSpot) => (
      <div><Text className="font-medium">{s.zone}</Text><Text className="text-ui-fg-muted text-sm">{s.floor}</Text></div>
    )},
    { key: "spot_number", header: "Spot #", sortable: true, cell: (s: ParkingSpot) => <Text className="font-medium">{s.spot_number}</Text> },
    { key: "type", header: "Type", cell: (s: ParkingSpot) => <Badge color={getTypeColor(s.type) as any}>{s.type}</Badge> },
    { key: "rate", header: "Rate", cell: (s: ParkingSpot) => (
      <div><Text className="font-medium text-sm">${s.rate_hourly}/hr</Text><Text className="text-ui-fg-muted text-sm">${s.rate_daily}/day</Text></div>
    )},
    { key: "vehicle", header: "Vehicle", cell: (s: ParkingSpot) => s.vehicle ? (
      <div><Text className="font-medium">{s.vehicle}</Text><Text className="text-ui-fg-muted text-sm">{s.license_plate}</Text></div>
    ) : <Text className="text-ui-fg-muted">—</Text> },
    { key: "status", header: "Status", cell: (s: ParkingSpot) => <StatusBadge status={s.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Parking Management</Heading><Text className="text-ui-fg-muted">Manage parking spots, zones, and occupancy</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={spots} columns={columns} searchable searchPlaceholder="Search spots..." searchKeys={["zone", "spot_number", "vehicle"]} loading={false} emptyMessage="No parking spots found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Parking", icon: Map })
export default ParkingPage
