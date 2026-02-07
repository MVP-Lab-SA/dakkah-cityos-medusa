import { model } from "@medusajs/framework/utils"

export const VendorAnalyticsSnapshot = model.define("vendor_analytics_snapshot", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Period
  period_type: model.enum(["daily", "weekly", "monthly", "yearly"]),
  period_start: model.dateTime(),
  period_end: model.dateTime(),
  
  // Orders
  total_orders: model.number().default(0),
  completed_orders: model.number().default(0),
  cancelled_orders: model.number().default(0),
  returned_orders: model.number().default(0),
  
  // Revenue
  gross_revenue: model.bigNumber().default(0),
  net_revenue: model.bigNumber().default(0),
  total_commission: model.bigNumber().default(0),
  total_refunds: model.bigNumber().default(0),
  
  // Products
  total_products: model.number().default(0),
  active_products: model.number().default(0),
  out_of_stock_products: model.number().default(0),
  
  // Performance
  average_order_value: model.bigNumber().default(0),
  average_fulfillment_time_hours: model.number().default(0),
  on_time_delivery_rate: model.bigNumber().default(0), // Percentage
  
  // Customer Metrics
  unique_customers: model.number().default(0),
  repeat_customers: model.number().default(0),
  average_rating: model.bigNumber().nullable(),
  total_reviews: model.number().default(0),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["vendor_id"] },
  { on: ["tenant_id", "vendor_id"] },
  { on: ["period_type", "period_start"] },
])

export const VendorPerformanceMetric = model.define("vendor_performance_metric", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Metric Details
  metric_type: model.enum([
    "order_defect_rate",
    "late_shipment_rate",
    "cancellation_rate",
    "return_rate",
    "response_time",
    "customer_satisfaction",
    "policy_compliance"
  ]),
  
  // Value
  value: model.bigNumber(),
  threshold_warning: model.bigNumber().nullable(),
  threshold_critical: model.bigNumber().nullable(),
  
  // Status
  status: model.enum(["good", "warning", "critical"]).default("good"),
  
  // Period
  measured_at: model.dateTime(),
  period_days: model.number().default(30), // Rolling period
  
  // Sample Size
  sample_count: model.number().default(0),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["vendor_id"] },
  { on: ["metric_type"] },
  { on: ["status"] },
  { on: ["measured_at"] },
])
