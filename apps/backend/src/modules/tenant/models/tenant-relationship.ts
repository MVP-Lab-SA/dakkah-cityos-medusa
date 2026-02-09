import { model } from "@medusajs/framework/utils"

const TenantRelationship = model.define("tenant_relationship", {
  id: model.id().primaryKey(),
  
  host_tenant_id: model.text(),
  vendor_tenant_id: model.text(),
  
  relationship_type: model.enum(["marketplace_vendor", "franchise", "affiliate", "white_label", "partnership"]).default("marketplace_vendor"),
  
  status: model.enum(["pending", "active", "suspended", "terminated"]).default("pending"),
  
  commission_type: model.enum(["percentage", "flat", "tiered", "custom"]).default("percentage"),
  commission_rate: model.number().nullable(),
  commission_flat: model.bigNumber().nullable(),
  commission_tiers: model.json().nullable(),
  
  listing_scope: model.enum(["all", "approved_only", "category_restricted", "manual"]).default("approved_only"),
  allowed_categories: model.json().nullable(),
  
  revenue_share_model: model.json().nullable(),
  
  contract_start: model.dateTime().nullable(),
  contract_end: model.dateTime().nullable(),
  
  approved_by: model.text().nullable(),
  approved_at: model.dateTime().nullable(),
  
  terms: model.json().nullable(),
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["host_tenant_id"] },
  { on: ["vendor_tenant_id"] },
  { on: ["host_tenant_id", "vendor_tenant_id"], unique: true },
  { on: ["status"] },
])

export default TenantRelationship
