import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { BuildingStorefront, CurrencyDollar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Property = {
  id: string
  title: string
  type: string
  price: number
  location: string
  status: string
  bedrooms: number
  bathrooms: number
  sqft: number
  listing_type: string
}

const mockProperties: Property[] = [
  { id: "prop_01", title: "Modern Downtown Loft", type: "Apartment", price: 450000, location: "123 Main St, Downtown", status: "active", bedrooms: 2, bathrooms: 2, sqft: 1200, listing_type: "sale" },
  { id: "prop_02", title: "Suburban Family Home", type: "House", price: 685000, location: "456 Oak Ave, Suburbia", status: "active", bedrooms: 4, bathrooms: 3, sqft: 2800, listing_type: "sale" },
  { id: "prop_03", title: "Waterfront Condo", type: "Condo", price: 3500, location: "789 Harbor Blvd", status: "active", bedrooms: 1, bathrooms: 1, sqft: 850, listing_type: "rent" },
  { id: "prop_04", title: "Commercial Office Space", type: "Commercial", price: 8500, location: "321 Business Park Dr", status: "active", bedrooms: 0, bathrooms: 2, sqft: 3500, listing_type: "rent" },
  { id: "prop_05", title: "Luxury Penthouse", type: "Penthouse", price: 1250000, location: "555 Skyline Tower", status: "pending", bedrooms: 3, bathrooms: 3, sqft: 3200, listing_type: "sale" },
  { id: "prop_06", title: "Cozy Studio Apartment", type: "Studio", price: 1800, location: "222 College Rd", status: "active", bedrooms: 0, bathrooms: 1, sqft: 450, listing_type: "rent" },
  { id: "prop_07", title: "Ranch-Style Estate", type: "House", price: 920000, location: "888 Country Lane", status: "sold", bedrooms: 5, bathrooms: 4, sqft: 4200, listing_type: "sale" },
  { id: "prop_08", title: "Beachfront Villa", type: "Villa", price: 2100000, location: "100 Ocean Dr", status: "active", bedrooms: 6, bathrooms: 5, sqft: 5500, listing_type: "sale" },
]

const RealEstatePage = () => {
  const properties = mockProperties
  const forSale = properties.filter(p => p.listing_type === "sale").length
  const forRent = properties.filter(p => p.listing_type === "rent").length
  const saleProperties = properties.filter(p => p.listing_type === "sale")
  const avgPrice = saleProperties.length > 0 ? Math.round(saleProperties.reduce((s, p) => s + p.price, 0) / saleProperties.length) : 0

  const stats = [
    { label: "Total Listings", value: properties.length, icon: <BuildingStorefront className="w-5 h-5" /> },
    { label: "For Sale", value: forSale, color: "blue" as const },
    { label: "For Rent", value: forRent, color: "green" as const },
    { label: "Avg Price", value: `$${avgPrice.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "orange" as const },
  ]

  const columns = [
    { key: "title", header: "Property", sortable: true, cell: (p: Property) => (
      <div><Text className="font-medium">{p.title}</Text><Text className="text-ui-fg-muted text-sm">{p.location}</Text></div>
    )},
    { key: "type", header: "Type", cell: (p: Property) => <Badge color="grey">{p.type}</Badge> },
    { key: "listing_type", header: "Listing", cell: (p: Property) => (
      <Badge color={p.listing_type === "sale" ? "blue" : "green"}>{p.listing_type === "sale" ? "For Sale" : "For Rent"}</Badge>
    )},
    { key: "price", header: "Price", sortable: true, cell: (p: Property) => (
      <Text className="font-medium">{p.listing_type === "rent" ? `$${p.price.toLocaleString()}/mo` : `$${p.price.toLocaleString()}`}</Text>
    )},
    { key: "details", header: "Details", cell: (p: Property) => (
      <Text className="text-sm">{p.bedrooms > 0 ? `${p.bedrooms} bd / ${p.bathrooms} ba` : `${p.bathrooms} ba`} · {p.sqft.toLocaleString()} sqft</Text>
    )},
    { key: "status", header: "Status", cell: (p: Property) => <StatusBadge status={p.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Real Estate Listings</Heading><Text className="text-ui-fg-muted">Manage property listings, sales, and rentals</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={properties} columns={columns} searchable searchPlaceholder="Search properties..." searchKeys={["title", "location", "type"]} loading={false} emptyMessage="No properties found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Real Estate", icon: BuildingStorefront })
export default RealEstatePage
