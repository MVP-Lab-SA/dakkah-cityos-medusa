import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { FlyingBox, CurrencyDollar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  condition: string
  status: string
  vin: string
  color: string
}

const mockVehicles: Vehicle[] = [
  { id: "veh_01", make: "Toyota", model: "Camry", year: 2024, price: 28500, mileage: 1200, condition: "new", status: "available", vin: "1HGCG5655WA...", color: "Silver" },
  { id: "veh_02", make: "BMW", model: "X5", year: 2023, price: 62000, mileage: 15000, condition: "certified", status: "available", vin: "5UXCR6C05N9...", color: "Black" },
  { id: "veh_03", make: "Ford", model: "F-150", year: 2024, price: 45900, mileage: 500, condition: "new", status: "available", vin: "1FTFW1E80NK...", color: "Blue" },
  { id: "veh_04", make: "Honda", model: "Civic", year: 2022, price: 21000, mileage: 32000, condition: "used", status: "available", vin: "2HGFC2F69NH...", color: "Red" },
  { id: "veh_05", make: "Tesla", model: "Model 3", year: 2024, price: 42990, mileage: 800, condition: "new", status: "reserved", vin: "5YJ3E1EA8PF...", color: "White" },
  { id: "veh_06", make: "Mercedes", model: "C-Class", year: 2021, price: 35500, mileage: 28000, condition: "certified", status: "trade-in", vin: "W1KWF8DB3MR...", color: "Grey" },
  { id: "veh_07", make: "Chevrolet", model: "Tahoe", year: 2023, price: 56800, mileage: 12000, condition: "used", status: "available", vin: "1GNSKBKD5PR...", color: "Black" },
  { id: "veh_08", make: "Audi", model: "A4", year: 2024, price: 41500, mileage: 200, condition: "new", status: "sold", vin: "WAUDNAF42RN...", color: "White" },
]

const AutomotivePage = () => {
  const vehicles = mockVehicles
  const forSale = vehicles.filter(v => v.status === "available").length
  const tradeIns = vehicles.filter(v => v.status === "trade-in").length
  const avgPrice = Math.round(vehicles.reduce((s, v) => s + v.price, 0) / vehicles.length)

  const stats = [
    { label: "Total Vehicles", value: vehicles.length, icon: <FlyingBox className="w-5 h-5" /> },
    { label: "For Sale", value: forSale, color: "green" as const },
    { label: "Trade-Ins", value: tradeIns, color: "orange" as const },
    { label: "Avg Price", value: `$${avgPrice.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "blue" as const },
  ]

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new": return "green"
      case "certified": return "blue"
      case "used": return "orange"
      default: return "grey"
    }
  }

  const columns = [
    { key: "vehicle", header: "Vehicle", sortable: true, cell: (v: Vehicle) => (
      <div><Text className="font-medium">{v.year} {v.make} {v.model}</Text><Text className="text-ui-fg-muted text-sm">{v.color} · VIN: {v.vin}</Text></div>
    )},
    { key: "price", header: "Price", sortable: true, cell: (v: Vehicle) => <Text className="font-medium">${v.price.toLocaleString()}</Text> },
    { key: "mileage", header: "Mileage", sortable: true, cell: (v: Vehicle) => `${v.mileage.toLocaleString()} mi` },
    { key: "condition", header: "Condition", cell: (v: Vehicle) => <Badge color={getConditionColor(v.condition) as any}>{v.condition.charAt(0).toUpperCase() + v.condition.slice(1)}</Badge> },
    { key: "status", header: "Status", cell: (v: Vehicle) => <StatusBadge status={v.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Automotive / Vehicles</Heading><Text className="text-ui-fg-muted">Manage vehicle inventory, trade-ins, and sales</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={vehicles} columns={columns} searchable searchPlaceholder="Search vehicles..." searchKeys={["make", "model", "color"]} loading={false} emptyMessage="No vehicles found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Automotive", icon: FlyingBox })
export default AutomotivePage
