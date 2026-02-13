import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { Sparkles, CurrencyDollar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Campaign = {
  id: string
  title: string
  creator: string
  creator_email: string
  goal: number
  pledged: number
  backers: number
  days_left: number
  status: string
  category: string
}

const mockCampaigns: Campaign[] = [
  { id: "cf_01", title: "EcoBreeze - Solar Powered Air Purifier", creator: "GreenTech Labs", creator_email: "team@greentech.io", goal: 100000, pledged: 128500, backers: 1842, days_left: 12, status: "funded", category: "Technology" },
  { id: "cf_02", title: "Artisan Coffee Table Book Collection", creator: "Maya Rodriguez", creator_email: "maya@artbooks.co", goal: 25000, pledged: 18200, backers: 423, days_left: 21, status: "active", category: "Publishing" },
  { id: "cf_03", title: "SmartGarden - Automated Indoor Garden", creator: "UrbanGrow Inc", creator_email: "hello@urbangrow.com", goal: 75000, pledged: 92300, backers: 1205, days_left: 0, status: "funded", category: "Home" },
  { id: "cf_04", title: "Indie Game: Celestial Odyssey", creator: "PixelForge Studio", creator_email: "dev@pixelforge.gg", goal: 50000, pledged: 31400, backers: 876, days_left: 35, status: "active", category: "Games" },
  { id: "cf_05", title: "Sustainable Fashion Line - ReThread", creator: "Emma Nakamura", creator_email: "emma@rethread.co", goal: 40000, pledged: 12800, backers: 298, days_left: 45, status: "active", category: "Fashion" },
  { id: "cf_06", title: "Community Makerspace Workshop", creator: "BuildTogether", creator_email: "info@buildtogether.org", goal: 60000, pledged: 60000, backers: 752, days_left: 0, status: "funded", category: "Community" },
  { id: "cf_07", title: "Documentary: Ocean Guardians", creator: "BlueLens Films", creator_email: "films@bluelens.com", goal: 35000, pledged: 8900, backers: 156, days_left: 58, status: "active", category: "Film" },
  { id: "cf_08", title: "Portable Wind Turbine Charger", creator: "WindCharge Co", creator_email: "team@windcharge.io", goal: 150000, pledged: 5200, backers: 89, days_left: 0, status: "cancelled", category: "Technology" },
]

const CrowdfundingPage = () => {
  const campaigns = mockCampaigns
  const activeCampaigns = campaigns.filter(c => c.status === "active").length
  const fundedCampaigns = campaigns.filter(c => c.status === "funded").length
  const totalRaised = campaigns.reduce((s, c) => s + c.pledged, 0)

  const stats = [
    { label: "Total Campaigns", value: campaigns.length, icon: <Sparkles className="w-5 h-5" /> },
    { label: "Active", value: activeCampaigns, color: "blue" as const },
    { label: "Funded", value: fundedCampaigns, color: "green" as const },
    { label: "Total Raised", value: `$${totalRaised.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
  ]

  const columns = [
    { key: "title", header: "Campaign", sortable: true, cell: (c: Campaign) => (
      <div><Text className="font-medium">{c.title}</Text><Text className="text-ui-fg-muted text-sm">{c.creator} · {c.category}</Text></div>
    )},
    { key: "progress", header: "Progress", sortable: true, cell: (c: Campaign) => (
      <div>
        <Text className="font-medium text-sm">${c.pledged.toLocaleString()} / ${c.goal.toLocaleString()}</Text>
        <div className="w-24 h-1.5 bg-ui-bg-subtle rounded-full overflow-hidden mt-1">
          <div className="h-full bg-ui-tag-green-icon rounded-full" style={{ width: `${Math.min(100, Math.round((c.pledged / c.goal) * 100))}%` }} />
        </div>
      </div>
    )},
    { key: "backers", header: "Backers", sortable: true, cell: (c: Campaign) => c.backers.toLocaleString() },
    { key: "days_left", header: "Days Left", sortable: true, cell: (c: Campaign) => (
      <Text className={c.days_left > 0 ? "font-medium" : "text-ui-fg-muted"}>{c.days_left > 0 ? `${c.days_left} days` : "Ended"}</Text>
    )},
    { key: "status", header: "Status", cell: (c: Campaign) => <StatusBadge status={c.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Crowdfunding</Heading><Text className="text-ui-fg-muted">Manage crowdfunding campaigns, backers, and pledges</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={campaigns} columns={columns} searchable searchPlaceholder="Search campaigns..." searchKeys={["title", "creator", "category"]} loading={false} emptyMessage="No campaigns found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Crowdfunding", icon: Sparkles })
export default CrowdfundingPage
