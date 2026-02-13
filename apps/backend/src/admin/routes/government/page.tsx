import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { BuildingStorefront } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type GovService = {
  id: string
  name: string
  department: string
  description: string
  processing_time: string
  fee: number
  applications: number
  approved: number
  status: string
}

const mockServices: GovService[] = [
  { id: "gov_01", name: "Business License Application", department: "Commerce & Trade", description: "New business registration and licensing", processing_time: "5-7 days", fee: 250, applications: 342, approved: 298, status: "active" },
  { id: "gov_02", name: "Building Permit Request", department: "Urban Planning", description: "Construction and renovation permits", processing_time: "10-14 days", fee: 500, applications: 156, approved: 112, status: "active" },
  { id: "gov_03", name: "Environmental Impact Assessment", department: "Environment", description: "Environmental compliance review", processing_time: "30-45 days", fee: 1200, applications: 28, approved: 15, status: "active" },
  { id: "gov_04", name: "Food Handler Certification", department: "Health & Safety", description: "Food service worker certification", processing_time: "1-2 days", fee: 75, applications: 890, approved: 845, status: "active" },
  { id: "gov_05", name: "Street Vendor Permit", department: "Commerce & Trade", description: "Mobile vending authorization", processing_time: "3-5 days", fee: 150, applications: 67, approved: 52, status: "active" },
  { id: "gov_06", name: "Noise Ordinance Waiver", department: "Public Safety", description: "Temporary noise level exemption", processing_time: "7-10 days", fee: 100, applications: 43, approved: 31, status: "active" },
  { id: "gov_07", name: "Historic Preservation Review", department: "Cultural Affairs", description: "Heritage building modification approval", processing_time: "20-30 days", fee: 350, applications: 12, approved: 8, status: "active" },
  { id: "gov_08", name: "Taxi/Rideshare License", department: "Transportation", description: "Commercial passenger transport license", processing_time: "5-7 days", fee: 200, applications: 234, approved: 189, status: "suspended" },
]

const GovernmentPage = () => {
  const services = mockServices
  const totalApplications = services.reduce((s, svc) => s + svc.applications, 0)
  const totalApproved = services.reduce((s, svc) => s + svc.approved, 0)
  const processing = totalApplications - totalApproved

  const stats = [
    { label: "Total Services", value: services.length, icon: <BuildingStorefront className="w-5 h-5" /> },
    { label: "Applications", value: totalApplications.toLocaleString(), color: "blue" as const },
    { label: "Approved", value: totalApproved.toLocaleString(), color: "green" as const },
    { label: "Processing", value: processing, color: "orange" as const },
  ]

  const columns = [
    { key: "name", header: "Service", sortable: true, cell: (s: GovService) => (
      <div><Text className="font-medium">{s.name}</Text><Text className="text-ui-fg-muted text-sm">{s.description}</Text></div>
    )},
    { key: "department", header: "Department", cell: (s: GovService) => <Badge color="grey">{s.department}</Badge> },
    { key: "processing_time", header: "Processing", cell: (s: GovService) => s.processing_time },
    { key: "fee", header: "Fee", sortable: true, cell: (s: GovService) => <Text className="font-medium">${s.fee}</Text> },
    { key: "applications", header: "Applications", sortable: true, cell: (s: GovService) => (
      <div><Text className="font-medium">{s.applications}</Text><Text className="text-ui-fg-muted text-sm">{s.approved} approved</Text></div>
    )},
    { key: "status", header: "Status", cell: (s: GovService) => <StatusBadge status={s.status} /> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Government Services</Heading><Text className="text-ui-fg-muted">Manage government services, applications, and permits</Text></div>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={services} columns={columns} searchable searchPlaceholder="Search services..." searchKeys={["name", "department"]} loading={false} emptyMessage="No government services found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Government", icon: BuildingStorefront })
export default GovernmentPage
