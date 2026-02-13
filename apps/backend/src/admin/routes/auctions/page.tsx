import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { ShoppingBag } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Auction = {
  id: string
  item: string
  seller: string
  starting_bid: number
  current_bid: number
  bids_count: number
  time_left: string
  status: string
  category: string
}

const mockAuctions: Auction[] = [
  { id: "auc_01", item: "Vintage Rolex Submariner 1969", seller: "LuxeTimepieces", starting_bid: 15000, current_bid: 28500, bids_count: 47, time_left: "2h 15m", status: "live", category: "Watches" },
  { id: "auc_02", item: "Signed Michael Jordan Jersey", seller: "SportsMemorabilia", starting_bid: 5000, current_bid: 12800, bids_count: 32, time_left: "5h 42m", status: "live", category: "Sports" },
  { id: "auc_03", item: "1962 Fender Stratocaster", seller: "VintageGuitars", starting_bid: 20000, current_bid: 45000, bids_count: 23, time_left: "0m", status: "ended", category: "Music" },
  { id: "auc_04", item: "Original Banksy Print - Girl with Balloon", seller: "ArtCollective", starting_bid: 50000, current_bid: 82000, bids_count: 18, time_left: "1d 4h", status: "live", category: "Art" },
  { id: "auc_05", item: "Rare 1st Edition Harry Potter", seller: "BookVault", starting_bid: 8000, current_bid: 8000, bids_count: 0, time_left: "3d 8h", status: "scheduled", category: "Books" },
  { id: "auc_06", item: "2019 Porsche 911 GT3 RS", seller: "ExoticAutos", starting_bid: 180000, current_bid: 210000, bids_count: 12, time_left: "0m", status: "ended", category: "Vehicles" },
  { id: "auc_07", item: "Diamond Engagement Ring 3.5ct", seller: "PremiumGems", starting_bid: 25000, current_bid: 38900, bids_count: 29, time_left: "8h 30m", status: "live", category: "Jewelry" },
  { id: "auc_08", item: "Antique Chinese Vase Dynasty Era", seller: "AsiaAntiques", starting_bid: 10000, current_bid: 15200, bids_count: 14, time_left: "12h 10m", status: "live", category: "Antiques" },
]

const AuctionsPage = () => {
  const auctions = mockAuctions
  const liveNow = auctions.filter(a => a.status === "live").length
  const endedToday = auctions.filter(a => a.status === "ended").length
  const totalBids = auctions.reduce((s, a) => s + a.bids_count, 0)

  const stats = [
    { label: "Total Auctions", value: auctions.length, icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Live Now", value: liveNow, color: "green" as const },
    { label: "Ended Today", value: endedToday, color: "orange" as const },
    { label: "Total Bids", value: totalBids, color: "blue" as const },
  ]

  const columns = [
    { key: "item", header: "Item", sortable: true, cell: (a: Auction) => (
      <div><Text className="font-medium">{a.item}</Text><Text className="text-ui-fg-muted text-sm">{a.seller} · {a.category}</Text></div>
    )},
    { key: "current_bid", header: "Current Bid", sortable: true, cell: (a: Auction) => (
      <div><Text className="font-medium">${a.current_bid.toLocaleString()}</Text><Text className="text-ui-fg-muted text-sm">Start: ${a.starting_bid.toLocaleString()}</Text></div>
    )},
    { key: "bids_count", header: "Bids", sortable: true, cell: (a: Auction) => a.bids_count },
    { key: "time_left", header: "Time Left", cell: (a: Auction) => (
      <Text className={a.status === "live" ? "text-ui-tag-green-text font-medium" : "text-ui-fg-muted"}>{a.status === "ended" ? "Ended" : a.time_left}</Text>
    )},
    { key: "status", header: "Status", cell: (a: Auction) => <StatusBadge status={a.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Auction Management</Heading><Text className="text-ui-fg-muted">Manage auctions, bids, and listings</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={auctions} columns={columns} searchable searchPlaceholder="Search auctions..." searchKeys={["item", "seller", "category"]} loading={false} emptyMessage="No auctions found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Auctions", icon: ShoppingBag })
export default AuctionsPage
