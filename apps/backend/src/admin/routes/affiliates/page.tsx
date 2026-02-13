import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Users, CurrencyDollar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Affiliate = {
  id: string
  name: string
  email: string
  code: string
  referrals: number
  conversions: number
  conversion_rate: number
  clicks_month: number
  commission_earned: number
  status: string
  tier: string
}

const mockAffiliates: Affiliate[] = [
  { id: "aff_01", name: "Jessica Taylor", email: "jessica@influencer.co", code: "JESS20", referrals: 342, conversions: 89, conversion_rate: 26.0, clicks_month: 1250, commission_earned: 4850, status: "active", tier: "Gold" },
  { id: "aff_02", name: "Tech Reviews Daily", email: "partner@techreviews.com", code: "TECHREV", referrals: 1205, conversions: 312, conversion_rate: 25.9, clicks_month: 4200, commission_earned: 18920, status: "active", tier: "Platinum" },
  { id: "aff_03", name: "Marcus Johnson", email: "marcus@blogspot.io", code: "MARCUS10", referrals: 156, conversions: 42, conversion_rate: 26.9, clicks_month: 620, commission_earned: 2100, status: "active", tier: "Silver" },
  { id: "aff_04", name: "StyleWith Sarah", email: "sarah@stylewith.me", code: "STYLE15", referrals: 890, conversions: 201, conversion_rate: 22.6, clicks_month: 3100, commission_earned: 12450, status: "active", tier: "Gold" },
  { id: "aff_05", name: "Deal Hunters Blog", email: "deals@hunters.net", code: "DEALS25", referrals: 45, conversions: 8, conversion_rate: 17.8, clicks_month: 180, commission_earned: 320, status: "inactive", tier: "Bronze" },
  { id: "aff_06", name: "FitLife Channel", email: "partner@fitlife.tv", code: "FITLIFE", referrals: 678, conversions: 178, conversion_rate: 26.3, clicks_month: 2800, commission_earned: 9870, status: "active", tier: "Gold" },
  { id: "aff_07", name: "David Chen", email: "david@contentcreator.io", code: "DCHEN", referrals: 23, conversions: 3, conversion_rate: 13.0, clicks_month: 95, commission_earned: 150, status: "pending", tier: "Bronze" },
  { id: "aff_08", name: "HomeGoods Reviews", email: "team@homegoodsreviews.com", code: "HOME20", referrals: 432, conversions: 124, conversion_rate: 28.7, clicks_month: 1890, commission_earned: 7200, status: "active", tier: "Silver" },
]

const AffiliatesPage = () => {
  const affiliates = mockAffiliates
  const activeAffiliates = affiliates.filter(a => a.status === "active").length
  const clicksMonth = affiliates.reduce((s, a) => s + a.clicks_month, 0)
  const revenueGenerated = affiliates.reduce((s, a) => s + a.commission_earned, 0)

  const stats = [
    { label: "Total Affiliates", value: affiliates.length, icon: <Users className="w-5 h-5" /> },
    { label: "Active", value: activeAffiliates, color: "green" as const },
    { label: "Clicks This Month", value: clicksMonth.toLocaleString(), color: "blue" as const },
    { label: "Revenue Generated", value: `$${revenueGenerated.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
  ]

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum": return "purple"
      case "Gold": return "orange"
      case "Silver": return "blue"
      default: return "grey"
    }
  }

  const columns = [
    { key: "name", header: "Affiliate", sortable: true, cell: (a: Affiliate) => (
      <div><Text className="font-medium">{a.name}</Text><Text className="text-ui-fg-muted text-sm">{a.email} · {a.code}</Text></div>
    )},
    { key: "referrals", header: "Referrals", sortable: true, cell: (a: Affiliate) => a.referrals.toLocaleString() },
    { key: "conversions", header: "Conversions", sortable: true, cell: (a: Affiliate) => (
      <div><Text className="font-medium">{a.conversions}</Text><Text className="text-ui-fg-muted text-sm">{a.conversion_rate}% rate</Text></div>
    )},
    { key: "commission_earned", header: "Commission", sortable: true, cell: (a: Affiliate) => <Text className="font-medium">${a.commission_earned.toLocaleString()}</Text> },
    { key: "tier", header: "Tier", cell: (a: Affiliate) => <Badge color={getTierColor(a.tier) as any}>{a.tier}</Badge> },
    { key: "status", header: "Status", cell: (a: Affiliate) => <StatusBadge status={a.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Affiliate Program</Heading><Text className="text-ui-fg-muted">Manage affiliates, referrals, and commissions</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={affiliates} columns={columns} searchable searchPlaceholder="Search affiliates..." searchKeys={["name", "email", "code"]} loading={false} emptyMessage="No affiliates found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Affiliates", icon: Users })
export default AffiliatesPage
