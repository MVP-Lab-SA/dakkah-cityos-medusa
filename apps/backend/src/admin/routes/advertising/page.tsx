import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { RocketLaunch } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type AdCampaign = {
  id: string
  name: string
  advertiser: string
  type: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  start_date: string
  end_date: string
  status: string
}

const mockCampaigns: AdCampaign[] = [
  { id: "ad_01", name: "Summer Sale Banner Ads", advertiser: "FashionHub", type: "Display", budget: 5000, spent: 3200, impressions: 245000, clicks: 4900, ctr: 2.0, start_date: "2026-02-01", end_date: "2026-02-28", status: "active" },
  { id: "ad_02", name: "New Product Launch - Search", advertiser: "TechGadgets", type: "Search", budget: 10000, spent: 7800, impressions: 180000, clicks: 8100, ctr: 4.5, start_date: "2026-01-15", end_date: "2026-03-15", status: "active" },
  { id: "ad_03", name: "Brand Awareness Video", advertiser: "HealthPlus", type: "Video", budget: 15000, spent: 15000, impressions: 520000, clicks: 15600, ctr: 3.0, start_date: "2026-01-01", end_date: "2026-02-01", status: "completed" },
  { id: "ad_04", name: "Holiday Season Retargeting", advertiser: "GiftWorld", type: "Retargeting", budget: 8000, spent: 2100, impressions: 89000, clicks: 2670, ctr: 3.0, start_date: "2026-02-10", end_date: "2026-03-10", status: "active" },
  { id: "ad_05", name: "Sponsored Product Listings", advertiser: "HomeDecor Co", type: "Sponsored", budget: 3000, spent: 1450, impressions: 67000, clicks: 2010, ctr: 3.0, start_date: "2026-02-05", end_date: "2026-02-25", status: "active" },
  { id: "ad_06", name: "Email Newsletter Sponsorship", advertiser: "BookClub Pro", type: "Email", budget: 2000, spent: 0, impressions: 0, clicks: 0, ctr: 0, start_date: "2026-03-01", end_date: "2026-03-31", status: "scheduled" },
  { id: "ad_07", name: "Social Media Carousel", advertiser: "FitGear", type: "Social", budget: 6000, spent: 4800, impressions: 310000, clicks: 9300, ctr: 3.0, start_date: "2026-01-20", end_date: "2026-02-20", status: "active" },
  { id: "ad_08", name: "Influencer Partnership", advertiser: "BeautyBrand", type: "Influencer", budget: 20000, spent: 20000, impressions: 890000, clicks: 35600, ctr: 4.0, start_date: "2025-12-01", end_date: "2026-01-31", status: "completed" },
]

const AdvertisingPage = () => {
  const campaigns = mockCampaigns
  const activeAds = campaigns.filter(c => c.status === "active").length
  const impressionsToday = 42850
  const avgCtr = (campaigns.filter(c => c.ctr > 0).reduce((s, c) => s + c.ctr, 0) / campaigns.filter(c => c.ctr > 0).length).toFixed(1)

  const stats = [
    { label: "Total Campaigns", value: campaigns.length, icon: <RocketLaunch className="w-5 h-5" /> },
    { label: "Active Ads", value: activeAds, color: "green" as const },
    { label: "Impressions Today", value: impressionsToday.toLocaleString(), color: "blue" as const },
    { label: "Avg CTR", value: `${avgCtr}%`, color: "green" as const },
  ]

  const columns = [
    { key: "name", header: "Campaign", sortable: true, cell: (c: AdCampaign) => (
      <div><Text className="font-medium">{c.name}</Text><Text className="text-ui-fg-muted text-sm">{c.advertiser}</Text></div>
    )},
    { key: "type", header: "Type", cell: (c: AdCampaign) => <Badge color="grey">{c.type}</Badge> },
    { key: "budget", header: "Budget", sortable: true, cell: (c: AdCampaign) => (
      <div><Text className="font-medium">${c.budget.toLocaleString()}</Text><Text className="text-ui-fg-muted text-sm">Spent: ${c.spent.toLocaleString()}</Text></div>
    )},
    { key: "impressions", header: "Impressions", sortable: true, cell: (c: AdCampaign) => c.impressions.toLocaleString() },
    { key: "clicks", header: "Clicks", sortable: true, cell: (c: AdCampaign) => (
      <div><Text className="font-medium">{c.clicks.toLocaleString()}</Text><Text className="text-ui-fg-muted text-sm">{c.ctr}% CTR</Text></div>
    )},
    { key: "status", header: "Status", cell: (c: AdCampaign) => <StatusBadge status={c.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Advertising</Heading><Text className="text-ui-fg-muted">Manage ad campaigns, impressions, and performance</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={campaigns} columns={columns} searchable searchPlaceholder="Search campaigns..." searchKeys={["name", "advertiser", "type"]} loading={false} emptyMessage="No campaigns found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Advertising", icon: RocketLaunch })
export default AdvertisingPage
