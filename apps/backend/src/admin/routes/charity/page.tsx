import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Heart, CurrencyDollar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Campaign = {
  id: string
  name: string
  goal: number
  raised: number
  donors: number
  status: string
  category: string
  organizer: string
  end_date: string
}

const mockCampaigns: Campaign[] = [
  { id: "chr_01", name: "Clean Water for Rural Communities", goal: 50000, raised: 42350, donors: 892, status: "active", category: "Environment", organizer: "WaterAid Foundation", end_date: "2026-04-30" },
  { id: "chr_02", name: "School Supplies for Children", goal: 25000, raised: 25000, donors: 534, status: "completed", category: "Education", organizer: "BrightFutures", end_date: "2026-02-01" },
  { id: "chr_03", name: "Animal Shelter Renovation", goal: 75000, raised: 31200, donors: 421, status: "active", category: "Animals", organizer: "PawsFirst", end_date: "2026-06-15" },
  { id: "chr_04", name: "Emergency Disaster Relief Fund", goal: 100000, raised: 89500, donors: 2150, status: "active", category: "Humanitarian", organizer: "GlobalRelief", end_date: "2026-03-31" },
  { id: "chr_05", name: "Youth Sports Program", goal: 30000, raised: 18750, donors: 267, status: "active", category: "Sports", organizer: "CommunityFirst", end_date: "2026-05-20" },
  { id: "chr_06", name: "Medical Research Funding", goal: 200000, raised: 156000, donors: 3420, status: "active", category: "Health", organizer: "ResearchHope", end_date: "2026-08-01" },
  { id: "chr_07", name: "Hunger Relief Initiative", goal: 40000, raised: 40000, donors: 1890, status: "completed", category: "Food Security", organizer: "MealShare", end_date: "2026-01-15" },
  { id: "chr_08", name: "Arts & Culture Preservation", goal: 60000, raised: 12400, donors: 156, status: "draft", category: "Culture", organizer: "HeritageKeepers", end_date: "2026-09-30" },
]

const CharityPage = () => {
  const campaigns = mockCampaigns
  const activeCampaigns = campaigns.filter(c => c.status === "active").length
  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0)
  const todayDonations = 4280

  const stats = [
    { label: "Total Campaigns", value: campaigns.length, icon: <Heart className="w-5 h-5" /> },
    { label: "Donations Today", value: `$${todayDonations.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "blue" as const },
    { label: "Total Raised", value: `$${totalRaised.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
    { label: "Active Campaigns", value: activeCampaigns, color: "green" as const },
  ]

  const columns = [
    { key: "name", header: "Campaign", sortable: true, cell: (c: Campaign) => (
      <div><Text className="font-medium">{c.name}</Text><Text className="text-ui-fg-muted text-sm">{c.organizer}</Text></div>
    )},
    { key: "category", header: "Category", cell: (c: Campaign) => <Badge color="grey">{c.category}</Badge> },
    { key: "progress", header: "Progress", sortable: true, cell: (c: Campaign) => (
      <div>
        <Text className="font-medium text-sm">${c.raised.toLocaleString()} / ${c.goal.toLocaleString()}</Text>
        <div className="w-24 h-1.5 bg-ui-bg-subtle rounded-full overflow-hidden mt-1">
          <div className="h-full bg-ui-tag-green-icon rounded-full" style={{ width: `${Math.min(100, Math.round((c.raised / c.goal) * 100))}%` }} />
        </div>
      </div>
    )},
    { key: "donors", header: "Donors", sortable: true, cell: (c: Campaign) => c.donors.toLocaleString() },
    { key: "end_date", header: "End Date", sortable: true, cell: (c: Campaign) => c.end_date },
    { key: "status", header: "Status", cell: (c: Campaign) => <StatusBadge status={c.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Charity / Donations</Heading><Text className="text-ui-fg-muted">Manage fundraising campaigns, donations, and donors</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={campaigns} columns={columns} searchable searchPlaceholder="Search campaigns..." searchKeys={["name", "organizer", "category"]} loading={false} emptyMessage="No campaigns found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Charity", icon: Heart })
export default CharityPage
