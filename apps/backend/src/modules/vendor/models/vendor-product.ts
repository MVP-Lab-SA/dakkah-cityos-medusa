import { model } from "@medusajs/framework/utils"

export const VendorProduct = model.define("vendor_product", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),
  product_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Attribution
  is_primary_vendor: model.boolean().default(true), // For multi-vendor products
  attribution_percentage: model.bigNumber().default(100), // Revenue attribution
  
  // Status
  status: model.enum([
    "pending_approval",
    "approved",
    "rejected",
    "suspended",
    "discontinued"
  ]).default("pending_approval"),
  
  // Approval
  approved_by_id: model.text().nullable(),
  approved_at: model.dateTime().nullable(),
  rejection_reason: model.text().nullable(),
  
  // Inventory
  manage_inventory: model.boolean().default(true),
  vendor_sku: model.text().nullable(),
  vendor_cost: model.bigNumber().nullable(), // Vendor's cost
  suggested_price: model.bigNumber().nullable(),
  
  // Fulfillment
  fulfillment_method: model.enum([
    "vendor_ships",
    "platform_ships",
    "dropship"
  ]).default("vendor_ships"),
  lead_time_days: model.number().default(3),
  
  // Commission Override
  commission_override: model.boolean().default(false),
  commission_rate: model.bigNumber().nullable(),
  commission_type: model.enum(["percentage", "flat"]).nullable(),
  
  marketplace_tenant_id: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["vendor_id"] },
  { on: ["product_id"] },
  { on: ["tenant_id", "vendor_id"] },
  { on: ["status"] },
])
