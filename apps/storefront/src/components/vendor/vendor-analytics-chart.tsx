import { useState } from "react"
import { useVendorAnalytics } from "@/lib/hooks/use-vendor-analytics"
import type { VendorAnalyticsSnapshot } from "@/lib/types/vendors"

export function VendorAnalyticsChart() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("weekly")
  const { data, isLoading } = useVendorAnalytics({ period, limit: 12 })

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    )
  }

  const snapshots = data?.snapshots || []

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Analytics</h3>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded text-sm ${period === p ? "bg-white shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {snapshots.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No analytics data available yet
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Revenue"
              value={`$${totalMetric(snapshots, "revenue").toFixed(2)}`}
            />
            <MetricCard
              label="Orders"
              value={totalMetric(snapshots, "orders").toString()}
            />
            <MetricCard
              label="Avg Order Value"
              value={`$${avgMetric(snapshots, "average_order_value").toFixed(2)}`}
            />
            <MetricCard
              label="Conversion Rate"
              value={`${avgMetric(snapshots, "conversion_rate").toFixed(1)}%`}
            />
          </div>

          <div className="space-y-2">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="flex items-center gap-4 p-3 border rounded">
                <div className="text-sm text-muted-foreground w-32">
                  {new Date(snapshot.period_start).toLocaleDateString()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-sm">
                    <span>${snapshot.metrics.revenue.toFixed(2)}</span>
                    <span className="text-muted-foreground">{snapshot.metrics.orders} orders</span>
                    <span className="text-muted-foreground">{snapshot.metrics.units_sold} units</span>
                    <span className="text-muted-foreground">{snapshot.metrics.new_customers} new customers</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}

function totalMetric(snapshots: VendorAnalyticsSnapshot[], key: keyof VendorAnalyticsSnapshot["metrics"]): number {
  return snapshots.reduce((sum, s) => sum + (s.metrics[key] as number), 0)
}

function avgMetric(snapshots: VendorAnalyticsSnapshot[], key: keyof VendorAnalyticsSnapshot["metrics"]): number {
  if (snapshots.length === 0) return 0
  return totalMetric(snapshots, key) / snapshots.length
}
