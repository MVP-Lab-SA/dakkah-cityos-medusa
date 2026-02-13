import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { ShoppingCart, InboxSolid } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type GroceryItem = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  freshness: string
  unit: string
  supplier: string
  status: string
}

const mockGroceryItems: GroceryItem[] = [
  { id: "grc_01", name: "Organic Bananas", category: "Fruits", price: 1.29, stock: 450, freshness: "Fresh", unit: "bunch", supplier: "FreshFarms Co.", status: "active" },
  { id: "grc_02", name: "Whole Wheat Bread", category: "Bakery", price: 3.99, stock: 120, freshness: "Fresh", unit: "loaf", supplier: "Baker's Best", status: "active" },
  { id: "grc_03", name: "Organic Milk (1 Gallon)", category: "Dairy", price: 5.49, stock: 85, freshness: "Fresh", unit: "gallon", supplier: "Green Valley Dairy", status: "active" },
  { id: "grc_04", name: "Atlantic Salmon Fillet", category: "Seafood", price: 12.99, stock: 35, freshness: "Fresh", unit: "lb", supplier: "Ocean Harvest", status: "active" },
  { id: "grc_05", name: "Mixed Salad Greens", category: "Vegetables", price: 4.49, stock: 8, freshness: "Expiring Soon", unit: "bag", supplier: "FreshFarms Co.", status: "low_stock" },
  { id: "grc_06", name: "Free-Range Eggs (Dozen)", category: "Dairy", price: 6.99, stock: 200, freshness: "Fresh", unit: "dozen", supplier: "Happy Hens Farm", status: "active" },
  { id: "grc_07", name: "Artisan Cheese Selection", category: "Dairy", price: 15.99, stock: 0, freshness: "N/A", unit: "pack", supplier: "Cheese Masters", status: "out_of_stock" },
  { id: "grc_08", name: "Frozen Pizza Margherita", category: "Frozen Foods", price: 7.49, stock: 320, freshness: "Frozen", unit: "each", supplier: "ItalianBites", status: "active" },
  { id: "grc_09", name: "Organic Baby Spinach", category: "Vegetables", price: 3.99, stock: 65, freshness: "Fresh", unit: "bag", supplier: "FreshFarms Co.", status: "active" },
  { id: "grc_10", name: "Grass-Fed Ground Beef", category: "Meat", price: 8.99, stock: 45, freshness: "Fresh", unit: "lb", supplier: "Prairie Ranch", status: "active" },
]

const GroceryPage = () => {
  const items = mockGroceryItems
  const categories = new Set(items.map(i => i.category)).size
  const deliveryZones = 12
  const ordersToday = 347

  const stats = [
    { label: "Total Products", value: items.length, icon: <ShoppingCart className="w-5 h-5" /> },
    { label: "Categories", value: categories, color: "blue" as const },
    { label: "Delivery Zones", value: deliveryZones, icon: <InboxSolid className="w-5 h-5" />, color: "purple" as const },
    { label: "Orders Today", value: ordersToday, color: "green" as const },
  ]

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case "Fresh": return "green"
      case "Frozen": return "blue"
      case "Expiring Soon": return "orange"
      default: return "grey"
    }
  }

  const columns = [
    { key: "name", header: "Product", sortable: true, cell: (i: GroceryItem) => (
      <div><Text className="font-medium">{i.name}</Text><Text className="text-ui-fg-muted text-sm">{i.supplier}</Text></div>
    )},
    { key: "category", header: "Category", cell: (i: GroceryItem) => <Badge color="grey">{i.category}</Badge> },
    { key: "price", header: "Price", sortable: true, cell: (i: GroceryItem) => <Text className="font-medium">${i.price.toFixed(2)}/{i.unit}</Text> },
    { key: "stock", header: "Stock", sortable: true, cell: (i: GroceryItem) => (
      <Text className={`font-medium ${i.stock === 0 ? "text-ui-tag-red-text" : i.stock < 20 ? "text-ui-tag-orange-text" : ""}`}>
        {i.stock} {i.unit}s
      </Text>
    )},
    { key: "freshness", header: "Freshness", cell: (i: GroceryItem) => <Badge color={getFreshnessColor(i.freshness) as any}>{i.freshness}</Badge> },
    { key: "status", header: "Status", cell: (i: GroceryItem) => <StatusBadge status={i.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Grocery Management</Heading><Text className="text-ui-fg-muted">Manage grocery products, inventory, and delivery zones</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={items} columns={columns} searchable searchPlaceholder="Search products..." searchKeys={["name", "category", "supplier"]} loading={false} emptyMessage="No products found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Grocery", icon: ShoppingCart })
export default GroceryPage
