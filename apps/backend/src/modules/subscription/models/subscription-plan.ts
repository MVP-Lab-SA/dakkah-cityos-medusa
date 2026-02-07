import { model } from "@medusajs/framework/utils"

export const SubscriptionPlan = model.define("subscription_plan", {
  id: model.id().primaryKey(),
  tenant_id: model.text().nullable(),
  
  // Basic Info
  name: model.text(),
  handle: model.text().unique(),
  description: model.text().nullable(),
  
  // Status
  status: model.enum(["draft", "active", "archived"]).default("draft"),
  
  // Billing
  billing_interval: model.enum([
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "yearly"
  ]).default("monthly"),
  billing_interval_count: model.number().default(1),
  
  // Pricing
  currency_code: model.text().default("usd"),
  price: model.bigNumber(),
  compare_at_price: model.bigNumber().nullable(), // Original price for display
  
  // Trial
  trial_period_days: model.number().default(0),
  
  // Features
  features: model.json().nullable(), // Array of feature strings
  /*
  Example:
  [
    "Unlimited products",
    "Priority support",
    "Custom domain"
  ]
  */
  
  // Limits
  limits: model.json().nullable(),
  /*
  Example:
  {
    max_products: 100,
    max_orders: 1000,
    max_storage_gb: 5
  }
  */
  
  // Products included
  included_products: model.json().nullable(), // Product/variant IDs
  
  // Sorting
  sort_order: model.number().default(0),
  
  // Stripe
  stripe_price_id: model.text().nullable(),
  stripe_product_id: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["status"] },
  { on: ["handle"] },
])

export const SubscriptionDiscount = model.define("subscription_discount", {
  id: model.id().primaryKey(),
  tenant_id: model.text().nullable(),
  
  // Basic Info
  code: model.text().unique(),
  name: model.text(),
  
  // Discount Type
  discount_type: model.enum(["percentage", "fixed", "trial_extension"]),
  discount_value: model.bigNumber(), // Percentage or fixed amount
  
  // Duration
  duration: model.enum([
    "once",
    "repeating",
    "forever"
  ]).default("once"),
  duration_in_months: model.number().nullable(), // For repeating
  
  // Applicability
  applicable_plans: model.json().nullable(), // Plan IDs, null = all
  
  // Usage Limits
  max_redemptions: model.number().nullable(),
  current_redemptions: model.number().default(0),
  max_redemptions_per_customer: model.number().default(1),
  
  // Validity
  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime().nullable(),
  
  // Status
  is_active: model.boolean().default(true),
  
  // Stripe
  stripe_coupon_id: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["code"] },
  { on: ["is_active"] },
])
