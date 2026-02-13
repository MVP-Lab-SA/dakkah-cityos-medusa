import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { DocumentText } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type LegalCase = {
  id: string
  title: string
  client: string
  client_email: string
  type: string
  assigned_attorney: string
  filed_date: string
  priority: string
  status: string
}

const mockCases: LegalCase[] = [
  { id: "leg_01", title: "Trademark Infringement - Brand Protection", client: "Acme Corp", client_email: "legal@acme.com", type: "Intellectual Property", assigned_attorney: "Sarah Mitchell", filed_date: "2026-01-15", priority: "high", status: "active" },
  { id: "leg_02", title: "Vendor Contract Dispute Resolution", client: "TechVentures LLC", client_email: "ops@techventures.io", type: "Contract Dispute", assigned_attorney: "James Rodriguez", filed_date: "2026-02-01", priority: "medium", status: "active" },
  { id: "leg_03", title: "GDPR Compliance Review", client: "DataFlow Inc", client_email: "compliance@dataflow.eu", type: "Regulatory", assigned_attorney: "Emma Lawson", filed_date: "2026-01-20", priority: "high", status: "pending_review" },
  { id: "leg_04", title: "Employment Agreement Drafting", client: "GrowthStartup", client_email: "hr@growthstartup.co", type: "Employment", assigned_attorney: "Michael Chen", filed_date: "2026-02-05", priority: "low", status: "resolved" },
  { id: "leg_05", title: "Product Liability Claim Investigation", client: "SafeGoods Ltd", client_email: "safety@safegoods.com", type: "Product Liability", assigned_attorney: "Sarah Mitchell", filed_date: "2025-12-10", priority: "high", status: "active" },
  { id: "leg_06", title: "Merger & Acquisition Due Diligence", client: "CapitalGroup", client_email: "deals@capitalgroup.com", type: "Corporate", assigned_attorney: "James Rodriguez", filed_date: "2026-02-08", priority: "high", status: "pending_review" },
  { id: "leg_07", title: "Consumer Refund Policy Review", client: "RetailMax", client_email: "legal@retailmax.com", type: "Consumer Protection", assigned_attorney: "Emma Lawson", filed_date: "2026-01-28", priority: "medium", status: "resolved" },
  { id: "leg_08", title: "Data Breach Notification Process", client: "CloudSecure", client_email: "incident@cloudsecure.io", type: "Privacy", assigned_attorney: "Michael Chen", filed_date: "2026-02-12", priority: "high", status: "active" },
]

const LegalPage = () => {
  const cases = mockCases
  const activeCases = cases.filter(c => c.status === "active").length
  const resolvedCases = cases.filter(c => c.status === "resolved").length
  const pendingReview = cases.filter(c => c.status === "pending_review").length

  const stats = [
    { label: "Total Cases", value: cases.length, icon: <DocumentText className="w-5 h-5" /> },
    { label: "Active", value: activeCases, color: "blue" as const },
    { label: "Resolved", value: resolvedCases, color: "green" as const },
    { label: "Pending Review", value: pendingReview, color: "orange" as const },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "red"
      case "medium": return "orange"
      case "low": return "green"
      default: return "grey"
    }
  }

  const columns = [
    { key: "title", header: "Case", sortable: true, cell: (c: LegalCase) => (
      <div><Text className="font-medium">{c.title}</Text><Text className="text-ui-fg-muted text-sm">{c.type} · Filed {c.filed_date}</Text></div>
    )},
    { key: "client", header: "Client", cell: (c: LegalCase) => (
      <div><Text className="font-medium">{c.client}</Text><Text className="text-ui-fg-muted text-sm">{c.client_email}</Text></div>
    )},
    { key: "assigned_attorney", header: "Attorney", cell: (c: LegalCase) => c.assigned_attorney },
    { key: "priority", header: "Priority", cell: (c: LegalCase) => <Badge color={getPriorityColor(c.priority) as any}>{c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}</Badge> },
    { key: "status", header: "Status", cell: (c: LegalCase) => <StatusBadge status={c.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Legal Services</Heading><Text className="text-ui-fg-muted">Manage legal cases, compliance, and contracts</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={cases} columns={columns} searchable searchPlaceholder="Search cases..." searchKeys={["title", "client", "assigned_attorney", "type"]} loading={false} emptyMessage="No legal cases found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Legal", icon: DocumentText })
export default LegalPage
