import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Tag, ExclamationCircle } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Listing = {
  id: string
  title: string
  category: string
  price: number
  seller: string
  status: string
  posted_date: string
  location: string
  views: number
}

const mockListings: Listing[] = [
  { id: "cls_01", title: "2019 MacBook Pro 16\" - Like New", category: "Electronics", price: 1200, seller: "John Smith", status: "active", posted_date: "2026-02-10", location: "San Francisco, CA", views: 342 },
  { id: "cls_02", title: "Vintage Oak Dining Table Set", category: "Furniture", price: 850, seller: "Mary Johnson", status: "active", posted_date: "2026-02-08", location: "Portland, OR", views: 189 },
  { id: "cls_03", title: "Mountain Bike - Trek Marlin 7", category: "Sports & Outdoors", price: 650, seller: "David Wilson", status: "active", posted_date: "2026-02-12", location: "Denver, CO", views: 278 },
  { id: "cls_04", title: "Professional DSLR Camera Kit", category: "Electronics", price: 2200, seller: "Lisa Chen", status: "active", posted_date: "2026-02-05", location: "New York, NY", views: 456 },
  { id: "cls_05", title: "Leather Sofa - Brown", category: "Furniture", price: 400, seller: "Tom Brown", status: "expired", posted_date: "2026-01-15", location: "Austin, TX", views: 512 },
  { id: "cls_06", title: "Electric Guitar - Fender Stratocaster", category: "Music", price: 900, seller: "Alex Rivera", status: "active", posted_date: "2026-02-11", location: "Nashville, TN", views: 167 },
  { id: "cls_07", title: "Suspicious Electronics Bundle", category: "Electronics", price: 50, seller: "Unknown User", status: "flagged", posted_date: "2026-02-13", location: "Unknown", views: 89 },
  { id: "cls_08", title: "Baby Stroller - Uppababy Vista", category: "Baby & Kids", price: 350, seller: "Sarah Miller", status: "sold", posted_date: "2026-02-01", location: "Chicago, IL", views: 634 },
]

const ClassifiedsPage = () => {
  const listings = mockListings
  const activeCount = listings.filter(l => l.status === "active").length
  const expiredCount = listings.filter(l => l.status === "expired").length
  const flaggedCount = listings.filter(l => l.status === "flagged").length

  const stats = [
    { label: "Total Listings", value: listings.length, icon: <Tag className="w-5 h-5" /> },
    { label: "Active", value: activeCount, color: "green" as const },
    { label: "Expired", value: expiredCount, color: "orange" as const },
    { label: "Flagged", value: flaggedCount, icon: <ExclamationCircle className="w-5 h-5" />, color: "red" as const },
  ]

  const columns = [
    { key: "title", header: "Listing", sortable: true, cell: (l: Listing) => (
      <div><Text className="font-medium">{l.title}</Text><Text className="text-ui-fg-muted text-sm">{l.location}</Text></div>
    )},
    { key: "category", header: "Category", cell: (l: Listing) => <Badge color="grey">{l.category}</Badge> },
    { key: "price", header: "Price", sortable: true, cell: (l: Listing) => <Text className="font-medium">${l.price.toLocaleString()}</Text> },
    { key: "seller", header: "Seller", cell: (l: Listing) => l.seller },
    { key: "posted_date", header: "Posted", sortable: true, cell: (l: Listing) => l.posted_date },
    { key: "views", header: "Views", sortable: true, cell: (l: Listing) => l.views.toLocaleString() },
    { key: "status", header: "Status", cell: (l: Listing) => <StatusBadge status={l.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Classified Listings</Heading><Text className="text-ui-fg-muted">Manage classified ads, sellers, and moderation</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={listings} columns={columns} searchable searchPlaceholder="Search listings..." searchKeys={["title", "category", "seller"]} loading={false} emptyMessage="No listings found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Classifieds", icon: Tag })
export default ClassifiedsPage
