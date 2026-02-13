import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { ChatBubble, CurrencyDollar } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type SocialPost = {
  id: string
  content_preview: string
  platform: string
  author: string
  likes: number
  shares: number
  comments: number
  orders_generated: number
  revenue: number
  posted_at: string
  status: string
}

const mockPosts: SocialPost[] = [
  { id: "soc_01", content_preview: "✨ New arrivals just dropped! Check out our spring collection...", platform: "Instagram", author: "BrandOfficial", likes: 4520, shares: 892, comments: 234, orders_generated: 89, revenue: 5670, posted_at: "2026-02-13", status: "active" },
  { id: "soc_02", content_preview: "Flash sale alert! 40% off everything for the next 24 hours 🔥", platform: "TikTok", author: "MarketingTeam", likes: 12800, shares: 3400, comments: 567, orders_generated: 342, revenue: 18450, posted_at: "2026-02-12", status: "active" },
  { id: "soc_03", content_preview: "Behind the scenes: How our products are made sustainably 🌿", platform: "YouTube", author: "ContentCreator", likes: 2340, shares: 456, comments: 189, orders_generated: 23, revenue: 1890, posted_at: "2026-02-11", status: "active" },
  { id: "soc_04", content_preview: "Customer spotlight: See how @sarah_designs uses our tools!", platform: "Instagram", author: "BrandOfficial", likes: 3200, shares: 678, comments: 145, orders_generated: 67, revenue: 4230, posted_at: "2026-02-10", status: "active" },
  { id: "soc_05", content_preview: "Limited edition collab with @designer_x dropping Friday! 🎨", platform: "Twitter", author: "BrandOfficial", likes: 8900, shares: 2100, comments: 890, orders_generated: 156, revenue: 12340, posted_at: "2026-02-09", status: "active" },
  { id: "soc_06", content_preview: "Product review: Our top-rated items of January 2026", platform: "Facebook", author: "ContentTeam", likes: 1200, shares: 234, comments: 78, orders_generated: 34, revenue: 2100, posted_at: "2026-02-08", status: "active" },
  { id: "soc_07", content_preview: "Giveaway! Win a $500 shopping spree - details below 🎉", platform: "TikTok", author: "MarketingTeam", likes: 25600, shares: 8900, comments: 4500, orders_generated: 0, revenue: 0, posted_at: "2026-02-07", status: "completed" },
  { id: "soc_08", content_preview: "Tutorial: 5 ways to style our bestselling jacket", platform: "Instagram", author: "StyleInfluencer", likes: 5600, shares: 1200, comments: 345, orders_generated: 98, revenue: 7890, posted_at: "2026-02-06", status: "archived" },
]

const SocialCommercePage = () => {
  const posts = mockPosts
  const engagementRate = "4.8%"
  const ordersFromSocial = posts.reduce((s, p) => s + p.orders_generated, 0)
  const totalRevenue = posts.reduce((s, p) => s + p.revenue, 0)

  const stats = [
    { label: "Total Posts", value: posts.length, icon: <ChatBubble className="w-5 h-5" /> },
    { label: "Engagement Rate", value: engagementRate, color: "green" as const },
    { label: "Orders from Social", value: ordersFromSocial, color: "blue" as const },
    { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
  ]

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Instagram": return "purple"
      case "TikTok": return "blue"
      case "Twitter": return "blue"
      case "YouTube": return "red"
      case "Facebook": return "blue"
      default: return "grey"
    }
  }

  const columns = [
    { key: "content_preview", header: "Post", sortable: true, cell: (p: SocialPost) => (
      <div className="max-w-xs"><Text className="font-medium truncate">{p.content_preview}</Text><Text className="text-ui-fg-muted text-sm">{p.author} · {p.posted_at}</Text></div>
    )},
    { key: "platform", header: "Platform", cell: (p: SocialPost) => <Badge color={getPlatformColor(p.platform) as any}>{p.platform}</Badge> },
    { key: "engagement", header: "Engagement", sortable: true, cell: (p: SocialPost) => (
      <div><Text className="font-medium text-sm">❤️ {p.likes.toLocaleString()}</Text><Text className="text-ui-fg-muted text-sm">🔄 {p.shares.toLocaleString()} · 💬 {p.comments.toLocaleString()}</Text></div>
    )},
    { key: "orders_generated", header: "Orders", sortable: true, cell: (p: SocialPost) => <Text className="font-medium">{p.orders_generated}</Text> },
    { key: "revenue", header: "Revenue", sortable: true, cell: (p: SocialPost) => <Text className="font-medium">${p.revenue.toLocaleString()}</Text> },
    { key: "status", header: "Status", cell: (p: SocialPost) => <StatusBadge status={p.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Social Commerce</Heading><Text className="text-ui-fg-muted">Manage social media posts, engagement, and conversions</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={posts} columns={columns} searchable searchPlaceholder="Search posts..." searchKeys={["content_preview", "author", "platform"]} loading={false} emptyMessage="No social posts found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Social Commerce", icon: ChatBubble })
export default SocialCommercePage
