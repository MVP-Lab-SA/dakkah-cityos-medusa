import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Heart } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatsGrid } from "../../components/charts/stats-grid.js"
import { useWishlists } from "../../hooks/use-wishlists.js"
import type { WishlistItem } from "../../hooks/use-wishlists.js"

const WishlistsPage = () => {
  const { data, isLoading } = useWishlists()

  const items = data?.items || []
  const totalWishlists = items.reduce((s: number, i: WishlistItem) => s + (i.wishlist_count || 0), 0)
  const avgConversion = items.length > 0 ? (items.reduce((s: number, i: WishlistItem) => s + (i.conversion_pct || 0), 0) / items.length).toFixed(1) : "0"

  const stats = [
    { label: "Total Wishlists", value: totalWishlists.toLocaleString(), icon: <Heart className="w-5 h-5" />, color: "red" as const },
    { label: "Unique Products", value: items.length },
    { label: "Most Wishlisted", value: items[0]?.product_name || "—", color: "blue" as const },
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
        <DataTable data={items} columns={columns} searchable searchPlaceholder="Search products..." searchKeys={["product_name", "product_sku", "category"]} loading={isLoading} emptyMessage="No wishlist data found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Wishlists", icon: Heart })
export default WishlistsPage
