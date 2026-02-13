import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { BuildingStorefront, Star } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Restaurant = {
  id: string
  name: string
  cuisine: string
  rating: number
  order_count: number
  status: string
  location: string
  owner: string
}

const mockRestaurants: Restaurant[] = [
  { id: "rest_01", name: "Bella Italia", cuisine: "Italian", rating: 4.8, order_count: 156, status: "active", location: "Downtown", owner: "Marco Rossi" },
  { id: "rest_02", name: "Sakura Sushi", cuisine: "Japanese", rating: 4.6, order_count: 203, status: "active", location: "Midtown", owner: "Yuki Tanaka" },
  { id: "rest_03", name: "Taco Fiesta", cuisine: "Mexican", rating: 4.3, order_count: 89, status: "active", location: "East Side", owner: "Carlos Mendez" },
  { id: "rest_04", name: "Golden Dragon", cuisine: "Chinese", rating: 4.5, order_count: 178, status: "active", location: "Chinatown", owner: "Wei Chen" },
  { id: "rest_05", name: "Le Petit Bistro", cuisine: "French", rating: 4.9, order_count: 67, status: "active", location: "West End", owner: "Pierre Dupont" },
  { id: "rest_06", name: "Curry House", cuisine: "Indian", rating: 4.2, order_count: 134, status: "inactive", location: "South Bay", owner: "Raj Patel" },
  { id: "rest_07", name: "BBQ Pit", cuisine: "American", rating: 4.4, order_count: 245, status: "active", location: "North Shore", owner: "Jim Walker" },
  { id: "rest_08", name: "Mediterranean Grill", cuisine: "Mediterranean", rating: 4.7, order_count: 112, status: "active", location: "Harbor District", owner: "Nikos Papadopoulos" },
]

const RestaurantsPage = () => {
  const restaurants = mockRestaurants
  const activeCount = restaurants.filter(r => r.status === "active").length
  const totalOrders = restaurants.reduce((sum, r) => sum + r.order_count, 0)
  const avgRating = (restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length).toFixed(1)

  const stats = [
    { label: "Total Restaurants", value: restaurants.length, icon: <BuildingStorefront className="w-5 h-5" /> },
    { label: "Active", value: activeCount, color: "green" as const },
    { label: "Orders Today", value: totalOrders, color: "blue" as const },
    { label: "Avg Rating", value: avgRating, icon: <Star className="w-5 h-5" />, color: "orange" as const },
  ]

  const columns = [
    { key: "name", header: "Restaurant", sortable: true, cell: (r: Restaurant) => (
      <div><Text className="font-medium">{r.name}</Text><Text className="text-ui-fg-muted text-sm">{r.owner}</Text></div>
    )},
    { key: "cuisine", header: "Cuisine", cell: (r: Restaurant) => <Badge color="grey">{r.cuisine}</Badge> },
    { key: "rating", header: "Rating", sortable: true, cell: (r: Restaurant) => (
      <div className="flex items-center gap-1"><Star className="w-4 h-4 text-ui-tag-orange-icon" /><Text className="font-medium">{r.rating}</Text></div>
    )},
    { key: "order_count", header: "Orders", sortable: true, cell: (r: Restaurant) => r.order_count.toLocaleString() },
    { key: "location", header: "Location", cell: (r: Restaurant) => r.location },
    { key: "status", header: "Status", cell: (r: Restaurant) => <StatusBadge status={r.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Restaurant Management</Heading><Text className="text-ui-fg-muted">Manage restaurants, menus, and orders</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={restaurants} columns={columns} searchable searchPlaceholder="Search restaurants..." searchKeys={["name", "cuisine", "owner"]} loading={false} emptyMessage="No restaurants found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Restaurants", icon: BuildingStorefront })
export default RestaurantsPage
