import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, toast } from "@medusajs/ui"
import { ChartBar, ArrowDownTray, PlaySolid } from "@medusajs/icons"
import { useState } from "react"
import { DataTable } from "../../components/tables/data-table.js"
import { StatsGrid } from "../../components/charts/stats-grid.js"

type Report = {
  id: string
  name: string
  type: string
  schedule: string
  last_run: string
  status: string
  rows: number
}

const mockReports: Report[] = [
  { id: "rpt_1", name: "Sales Overview", type: "Revenue", schedule: "Daily", last_run: "2025-02-13 08:00", status: "completed", rows: 1240 },
  { id: "rpt_2", name: "Customer Acquisition", type: "Marketing", schedule: "Weekly", last_run: "2025-02-10 06:00", status: "completed", rows: 890 },
  { id: "rpt_3", name: "Inventory Turnover", type: "Operations", schedule: "Monthly", last_run: "2025-02-01 00:00", status: "completed", rows: 456 },
  { id: "rpt_4", name: "Vendor Performance", type: "Vendor", schedule: "Weekly", last_run: "2025-02-10 06:00", status: "completed", rows: 234 },
  { id: "rpt_5", name: "Conversion Funnel", type: "Marketing", schedule: "Daily", last_run: "2025-02-13 08:00", status: "running", rows: 0 },
  { id: "rpt_6", name: "Returns Analysis", type: "Operations", schedule: "On-demand", last_run: "2025-01-28 14:30", status: "completed", rows: 178 },
]

const AnalyticsPage = () => {
  const [reports, setReports] = useState<Report[]>(mockReports)

  const stats = [
    { label: "Total Reports", value: reports.length, icon: <ChartBar className="w-5 h-5" /> },
    { label: "Dashboards", value: 4, color: "blue" as const },
    { label: "Last Generated", value: "2 min ago", color: "green" as const },
    { label: "Running", value: reports.filter(r => r.status === "running").length, color: "orange" as const },
  ]

  const handleRunReport = (report: Report) => {
    setReports(reports.map(r => r.id === report.id ? { ...r, status: "running" } : r))
    toast.success(`Running "${report.name}"...`)
    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: "completed", last_run: new Date().toISOString().replace("T", " ").slice(0, 16), rows: Math.floor(Math.random() * 1000) + 100 } : r))
      toast.success(`"${report.name}" completed`)
    }, 2000)
  }

  const handleExport = (report: Report) => {
    toast.success(`Exporting "${report.name}" as CSV...`)
  }

  const getTypeColor = (type: string) => {
    switch (type) { case "Revenue": return "green"; case "Marketing": return "blue"; case "Operations": return "orange"; case "Vendor": return "purple"; default: return "grey" }
  }

  const columns = [
    { key: "name", header: "Report", sortable: true, cell: (r: Report) => <Text className="font-medium">{r.name}</Text> },
    { key: "type", header: "Type", cell: (r: Report) => <Badge color={getTypeColor(r.type)}>{r.type}</Badge> },
    { key: "schedule", header: "Schedule", cell: (r: Report) => <Badge color="grey">{r.schedule}</Badge> },
    { key: "last_run", header: "Last Run", sortable: true, cell: (r: Report) => <Text className="text-sm">{r.last_run}</Text> },
    { key: "rows", header: "Rows", cell: (r: Report) => r.status === "running" ? <Text className="text-ui-fg-muted">—</Text> : r.rows.toLocaleString() },
    { key: "status", header: "Status", cell: (r: Report) => (
      r.status === "running" ? <Badge color="blue">Running...</Badge> : <Badge color="green">Completed</Badge>
    )},
    { key: "actions", header: "", width: "120px", cell: (r: Report) => (
      <div className="flex gap-1">
        <Button variant="secondary" size="small" onClick={() => handleRunReport(r)} disabled={r.status === "running"}><PlaySolid className="w-3 h-3" /></Button>
        <Button variant="secondary" size="small" onClick={() => handleExport(r)} disabled={r.status === "running"}><ArrowDownTray className="w-3 h-3" /></Button>
      </div>
    )},
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Analytics & Reports</Heading><Text className="text-ui-fg-muted">View dashboards, run reports, and export data</Text></div>
        </div>
      </div>
      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>
      <div className="px-6 pb-6">
        <DataTable data={reports} columns={columns} searchable searchPlaceholder="Search reports..." searchKeys={["name", "type"]} emptyMessage="No reports found" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Analytics", icon: ChartBar })
export default AnalyticsPage
