import { useVendorPerformance } from "@/lib/hooks/use-vendor-analytics"
import type { VendorPerformanceMetric } from "@/lib/types/vendors"

export function VendorPerformanceCard() {
  const { data: metrics, isLoading } = useVendorPerformance()

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!metrics || metrics.length === 0) {
    return null
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Performance Metrics</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <MetricRow key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  )
}

function MetricRow({ metric }: { metric: VendorPerformanceMetric }) {
  const labels: Record<string, string> = {
    fulfillment_time: "Fulfillment Time",
    response_time: "Response Time",
    return_rate: "Return Rate",
    customer_satisfaction: "Customer Satisfaction",
    order_accuracy: "Order Accuracy",
  }

  const ratingStyles: Record<string, string> = {
    excellent: "text-ds-success bg-ds-success",
    good: "text-ds-info bg-ds-info",
    average: "text-ds-warning bg-ds-warning",
    below_average: "text-orange-700 bg-orange-100",
    poor: "text-ds-destructive bg-ds-destructive",
  }

  const trendIcons: Record<string, string> = {
    up: "↑",
    down: "↓",
    stable: "→",
  }

  const percentage = metric.benchmark > 0 ? (metric.value / metric.benchmark) * 100 : 0

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">{labels[metric.metric_type] || metric.metric_type}</span>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded ${ratingStyles[metric.rating] || "bg-ds-muted"}`}>
              {metric.rating.replace("_", " ")}
            </span>
            <span className={`text-sm ${metric.trend === "up" ? "text-ds-success" : metric.trend === "down" ? "text-ds-destructive" : "text-ds-muted-foreground"}`}>
              {trendIcons[metric.trend]}
            </span>
          </div>
        </div>
        <div className="w-full bg-ds-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full ${percentage >= 80 ? "bg-ds-success" : percentage >= 60 ? "bg-ds-warning" : "bg-ds-destructive"}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{metric.value}</span>
          <span>Target: {metric.benchmark}</span>
        </div>
      </div>
    </div>
  )
}
