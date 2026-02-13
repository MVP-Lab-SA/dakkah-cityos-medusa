import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { Users, CurrencyDollar, CheckCircle } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Gig = {
  id: string
  title: string
  freelancer: string
  category: string
  rate: number
  rate_type: string
  status: string
  completed_projects: number
  rating: number
}

const mockGigs: Gig[] = [
  { id: "gig_01", title: "Full-Stack Web Development", freelancer: "Alex Turner", category: "Development", rate: 95, rate_type: "hourly", status: "active", completed_projects: 47, rating: 4.9 },
  { id: "gig_02", title: "Brand Identity Design", freelancer: "Sophie Williams", category: "Design", rate: 2500, rate_type: "project", status: "active", completed_projects: 82, rating: 4.8 },
  { id: "gig_03", title: "SEO & Content Strategy", freelancer: "Mike Johnson", category: "Marketing", rate: 75, rate_type: "hourly", status: "active", completed_projects: 120, rating: 4.7 },
  { id: "gig_04", title: "Mobile App Development", freelancer: "Priya Sharma", category: "Development", rate: 110, rate_type: "hourly", status: "active", completed_projects: 31, rating: 4.9 },
  { id: "gig_05", title: "Video Production & Editing", freelancer: "Carlos Rivera", category: "Media", rate: 1800, rate_type: "project", status: "active", completed_projects: 65, rating: 4.6 },
  { id: "gig_06", title: "Technical Writing", freelancer: "Emma Watson", category: "Writing", rate: 60, rate_type: "hourly", status: "paused", completed_projects: 93, rating: 4.5 },
  { id: "gig_07", title: "Data Analysis & Visualization", freelancer: "Raj Patel", category: "Data Science", rate: 85, rate_type: "hourly", status: "active", completed_projects: 54, rating: 4.8 },
  { id: "gig_08", title: "Social Media Management", freelancer: "Jessica Moore", category: "Marketing", rate: 1200, rate_type: "monthly", status: "active", completed_projects: 38, rating: 4.4 },
]

const FreelancePage = () => {
  const gigs = mockGigs
  const activeFreelancers = gigs.filter(g => g.status === "active").length
  const totalCompleted = gigs.reduce((s, g) => s + g.completed_projects, 0)
  const totalRevenue = 284500

  const stats = [
    { label: "Total Gigs", value: gigs.length, icon: <Users className="w-5 h-5" /> },
    { label: "Active Freelancers", value: activeFreelancers, color: "green" as const },
    { label: "Completed Projects", value: totalCompleted, icon: <CheckCircle className="w-5 h-5" />, color: "blue" as const },
    { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
  ]

  const columns = [
    { key: "title", header: "Gig", sortable: true, cell: (g: Gig) => (
      <div><Text className="font-medium">{g.title}</Text><Text className="text-ui-fg-muted text-sm">{g.freelancer}</Text></div>
    )},
    { key: "category", header: "Category", cell: (g: Gig) => <Badge color="grey">{g.category}</Badge> },
    { key: "rate", header: "Rate", sortable: true, cell: (g: Gig) => (
      <Text className="font-medium">{g.rate_type === "hourly" ? `$${g.rate}/hr` : g.rate_type === "monthly" ? `$${g.rate.toLocaleString()}/mo` : `$${g.rate.toLocaleString()}`}</Text>
    )},
    { key: "completed_projects", header: "Completed", sortable: true, cell: (g: Gig) => g.completed_projects },
    { key: "rating", header: "Rating", sortable: true, cell: (g: Gig) => <Text className="font-medium">⭐ {g.rating}</Text> },
    { key: "status", header: "Status", cell: (g: Gig) => <StatusBadge status={g.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Freelance Marketplace</Heading><Text className="text-ui-fg-muted">Manage freelancer gigs, projects, and payments</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={gigs} columns={columns} searchable searchPlaceholder="Search gigs..." searchKeys={["title", "freelancer", "category"]} loading={false} emptyMessage="No gigs found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Freelance", icon: Users })
export default FreelancePage
