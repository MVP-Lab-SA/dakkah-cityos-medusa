import { model } from "@medusajs/framework/utils"

const MarketplaceListing = model.define("marketplace_listing", {
  id: model.id().primaryKey(),
  
  vendor_tenant_id: model.text(),
  host_tenant_id: model.text(),
  relationship_id: model.text(),
  
  product_id: model.text(),
  
  status: model.enum(["draft", "pending_review", "approved", "rejected", "suspended", "delisted"]).default("draft"),
  
  visibility: model.enum(["public", "unlisted", "private", "members_only"]).default("public"),
  
  commission_override: model.number().nullable(),
  
  price_override: model.bigNumber().nullable(),
  currency_override: model.text().nullable(),
  
  featured: model.boolean().default(false),
  featured_until: model.dateTime().nullable(),
  
  categories_on_host: model.json().nullable(),
  tags_on_host: model.json().nullable(),
  
  approved_by: model.text().nullable(),
  approved_at: model.dateTime().nullable(),
  rejected_reason: model.text().nullable(),
  
  impressions: model.number().default(0),
  clicks: model.number().default(0),
  conversions: model.number().default(0),
  
  listed_at: model.dateTime().nullable(),
  delisted_at: model.dateTime().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["vendor_tenant_id"] },
  { on: ["host_tenant_id"] },
  { on: ["relationship_id"] },
  { on: ["product_id"] },
  { on: ["vendor_tenant_id", "host_tenant_id", "product_id"], unique: true },
  { on: ["status"] },
])

export default MarketplaceListing
