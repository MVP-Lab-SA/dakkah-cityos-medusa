import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, toast } from "@medusajs/ui"
import { ChartBar, ArrowDownTray, PlaySolid } from "@medusajs/icons"
import { DataTable } from "../../components/tables/data-table.js"
import { StatsGrid } from "../../components/charts/stats-grid.js"
import { useAnalytics } from "../../hooks/use-analytics.js"

type ReportRow = {
  id: string
  name: string
  type: string
  value: string
}

const AnalyticsPage = () => {
  const { data, isLoading } = useAnalytics()

  const metricsEntries: ReportRow[] = data
    ? Object.entries(data).map(([key, val], idx) => ({
        id: `metric_${idx}`,
        name: key,
        type: typeof val === "object" ? "Object" : "Scalar",
        value: typeof val === "object" ? JSON.stringify(val) : String(val),
      }))
    : []

  const stats = [
    { label: "Total Metrics", value: metricsEntries.length, icon: <ChartBar className="w-5 h-5" /> },
    { label: "Uptime", value: data?.uptime ? `${Math.round(Number(data.uptime) / 60)}m` : "—", color: "green" as const },
    { label: "Data Source", value: "Live", color: "blue" as const },
    { label: "Status", value: isLoading ? "Loading..." : "Ready", color: "green" as const },
  ]

  const handleExport = () => {
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "metrics-export.json"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Metrics exported as JSON")
  }

  const getTypeColor = (type: string) => {
    switch (type) { case "Object": return "blue"; case "Scalar": return "green"; default: return "grey" }
  }

  const columns = [
    { key: "name", header: "Metric", sortable: true, cell: (r: ReportRow) => <Text className="font-medium">{r.name}</Text> },
    { key: "type", header: "Type", cell: (r: ReportRow) => <Badge color={getTypeColor(r.type)}>{r.type}</Badge> },
    { key: "value", header: "Value", cell: (r: ReportRow) => <Text className="text-sm max-w-md truncate">{r.value}</Text> },
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Analytics & Metrics</Heading><Text className="text-ui-fg-muted">View live metrics and system analytics</Text></div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExport} disabled={!data}><ArrowDownTray className="w-4 h-4 mr-1" />Export</Button>
          </div>
        </div>
      </div>
      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>
      <div className="px-6 pb-6">
        <DataTable data={metricsEntries} columns={columns} searchable searchPlaceholder="Search metrics..." searchKeys={["name", "type"]} loading={isLoading} emptyMessage="No metrics available" />
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Analytics", icon: ChartBar })
export default AnalyticsPage
