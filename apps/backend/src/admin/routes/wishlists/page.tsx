import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Heart } from "@medusajs/icons"
import { useState } from "react"
import { DataTable } from "../../components/tables/data-table.js"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type WishlistItem = {
  id: string
  product_name: string
  product_sku: string
  wishlist_count: number
  conversion_pct: number
  avg_price: string
  category: string
}

const mockWishlistItems: WishlistItem[] = [
  { id: "wl_1", product_name: "Premium Wireless Earbuds", product_sku: "SKU-1001", wishlist_count: 342, conversion_pct: 18.5, avg_price: "$129.99", category: "Electronics" },
  { id: "wl_2", product_name: "Organic Cotton Hoodie", product_sku: "SKU-2045", wishlist_count: 289, conversion_pct: 22.3, avg_price: "$59.99", category: "Apparel" },
  { id: "wl_3", product_name: "Smart Home Hub", product_sku: "SKU-3012", wishlist_count: 256, conversion_pct: 12.1, avg_price: "$199.99", category: "Electronics" },
  { id: "wl_4", product_name: "Titanium Water Bottle", product_sku: "SKU-4008", wishlist_count: 198, conversion_pct: 31.2, avg_price: "$34.99", category: "Lifestyle" },
  { id: "wl_5", product_name: "Running Jacket", product_sku: "SKU-2099", wishlist_count: 167, conversion_pct: 15.8, avg_price: "$89.99", category: "Apparel" },
  { id: "wl_6", product_name: "Mechanical Keyboard", product_sku: "SKU-3055", wishlist_count: 145, conversion_pct: 27.6, avg_price: "$149.99", category: "Electronics" },
]

const WishlistsPage = () => {
  const [items] = useState<WishlistItem[]>(mockWishlistItems)

  const totalWishlists = items.reduce((s, i) => s + i.wishlist_count, 0)
  const avgConversion = (items.reduce((s, i) => s + i.conversion_pct, 0) / items.length).toFixed(1)

  const stats = [
    { label: "Total Wishlists", value: totalWishlists.toLocaleString(), icon: <Heart className="w-5 h-5" />, color: "red" as const },
    { label: "Unique Products", value: items.length },
    { label: "Most Wishlisted", value: items[0]?.product_name || "-", color: "blue" as const },
    { label: "Avg Conversion", value: `${avgConversion}%`, color: "green" as const },
  ]

  const getConversionColor = (pct: number) => {
    if (pct >= 25) return "green"
    if (pct >= 15) return "orange"
    return "grey"
  }

  const columns = [
    { key: "product_name", header: "Product", sortable: true, cell: (i: WishlistItem) => (
      <div><Text className="font-medium">{i.product_name}</Text><Text className="text-ui-fg-muted text-sm">{i.product_sku}</Text></div>
    )},
    { key: "category", header: "Category", cell: (i: WishlistItem) => <Badge color="grey">{i.category}</Badge> },
    { key: "wishlist_count", header: "Wishlist Count", sortable: true, cell: (i: WishlistItem) => (
      <div className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" /><Text className="font-medium">{i.wishlist_count}</Text></div>
    )},
    { key: "conversion_pct", header: "Conversion %", sortable: true, cell: (i: WishlistItem) => <Badge color={getConversionColor(i.conversion_pct)}>{i.conversion_pct}%</Badge> },
    { key: "avg_price", header: "Price", cell: (i: WishlistItem) => <Text>{i.avg_price}</Text> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Wishlist Analytics</Heading><Text className="text-ui-fg-muted">Track wishlisted products and conversion insights</Text></div>
        </div>
      </div>
      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>
      <div className="px-6 pb-6">
        <DataTable data={items} columns={columns} searchable searchPlaceholder="Search products..." searchKeys={["product_name", "product_sku", "category"]} emptyMessage="No wishlist data found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Wishlists", icon: Heart })
export default WishlistsPage
