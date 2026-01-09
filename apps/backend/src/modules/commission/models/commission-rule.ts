import { model } from "@medusajs/framework/utils"

const CommissionRule = model.define("commission_rule", {
  id: model.id().primaryKey(),
  
  // Scoping
  tenant_id: model.text(),
  store_id: model.text().nullable(),
  vendor_id: model.text().nullable(), // If null, applies to all vendors
  
  // Rule Priority
  priority: model.number().default(0), // Higher number = higher priority
  
  // Rule Name
  name: model.text(),
  description: model.text().nullable(),
  
  // Commission Type
  commission_type: model.enum([
    "percentage",
    "flat",
    "tiered_percentage",
    "tiered_flat",
    "hybrid"
  ]),
  
  // Simple Commission (for percentage/flat)
  commission_percentage: model.number().nullable(), // e.g., 15.5 for 15.5%
  commission_flat_amount: model.bigNumber().nullable(), // In cents
  
  // Tiered Commission
  tiers: model.json().nullable(), // [{min_amount: 0, max_amount: 10000, rate: 20}, ...]
  
  // Conditions
  conditions: model.json().nullable(), // {product_categories: [], product_tags: [], min_order_value: 5000}
  
  // Date Range
  valid_from: model.dateTime().nullable(),
  valid_to: model.dateTime().nullable(),
  
  // Status
  status: model.enum([
    "active",
    "inactive",
    "scheduled"
  ]).default("active"),
  
  // Apply To
  applies_to: model.enum([
    "all_products",
    "specific_categories",
    "specific_products",
    "specific_collections"
  ]).default("all_products"),
  
  // Metadata
  metadata: model.json().nullable(),
})

export default CommissionRule
