import { model } from "@medusajs/framework/utils"

export const TenantBilling = model.define("tenant_billing", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  
  // Subscription
  subscription_status: model.enum([
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid"
  ]).default("trialing"),
  
  // Plan
  plan_id: model.text().nullable(),
  plan_name: model.text().nullable(),
  plan_type: model.enum(["monthly", "yearly"]).default("monthly"),
  
  // Pricing
  base_price: model.bigNumber().default(0),
  currency_code: model.text().default("usd"),
  
  // Usage-based billing
  usage_metering_enabled: model.boolean().default(false),
  usage_price_per_unit: model.bigNumber().nullable(),
  usage_unit_name: model.text().nullable(), // "order", "product", "GB"
  included_units: model.number().default(0),
  
  // Current Period
  current_period_start: model.dateTime().nullable(),
  current_period_end: model.dateTime().nullable(),
  current_usage: model.number().default(0),
  current_usage_cost: model.bigNumber().default(0),
  
  // Payment
  payment_method_id: model.text().nullable(),
  stripe_customer_id: model.text().nullable(),
  stripe_subscription_id: model.text().nullable(),
  
  // Invoice
  last_invoice_date: model.dateTime().nullable(),
  last_invoice_amount: model.bigNumber().nullable(),
  next_invoice_date: model.dateTime().nullable(),
  
  // Limits
  max_products: model.number().nullable(),
  max_orders_per_month: model.number().nullable(),
  max_storage_gb: model.number().nullable(),
  max_team_members: model.number().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["subscription_status"] },
  { on: ["stripe_customer_id"] },
  { on: ["next_invoice_date"] },
])

export const TenantUsageRecord = model.define("tenant_usage_record", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  billing_id: model.text(),
  
  // Usage Details
  usage_type: model.enum([
    "orders",
    "products",
    "storage",
    "api_calls",
    "bandwidth",
    "custom"
  ]),
  
  quantity: model.number(),
  unit_price: model.bigNumber().nullable(),
  total_cost: model.bigNumber().nullable(),
  
  // Period
  recorded_at: model.dateTime(),
  period_start: model.dateTime(),
  period_end: model.dateTime(),
  
  // Reference
  reference_type: model.text().nullable(), // "order", "product", etc.
  reference_id: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["billing_id"] },
  { on: ["usage_type", "period_start"] },
  { on: ["recorded_at"] },
])

export const TenantInvoice = model.define("tenant_invoice", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  billing_id: model.text(),
  
  // Invoice Details
  invoice_number: model.text().unique(),
  
  // Period
  period_start: model.dateTime(),
  period_end: model.dateTime(),
  
  // Amounts
  currency_code: model.text().default("usd"),
  base_amount: model.bigNumber().default(0),
  usage_amount: model.bigNumber().default(0),
  discount_amount: model.bigNumber().default(0),
  tax_amount: model.bigNumber().default(0),
  total_amount: model.bigNumber().default(0),
  
  // Status
  status: model.enum([
    "draft",
    "open",
    "paid",
    "void",
    "uncollectible"
  ]).default("draft"),
  
  // Payment
  paid_at: model.dateTime().nullable(),
  payment_method: model.text().nullable(),
  stripe_invoice_id: model.text().nullable(),
  
  // PDF
  invoice_pdf_url: model.text().nullable(),
  
  // Due Date
  due_date: model.dateTime().nullable(),
  
  // Line Items
  line_items: model.json().nullable(), // Array of line items
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["billing_id"] },
  { on: ["status"] },
  { on: ["due_date"] },
])
