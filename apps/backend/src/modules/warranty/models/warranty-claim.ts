import { model } from "@medusajs/framework/utils"

const WarrantyClaim = model.define("warranty_claim", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  plan_id: model.text().nullable(),
  customer_id: model.text(),
  order_id: model.text(),
  product_id: model.text(),
  claim_number: model.text().unique(),
  issue_description: model.text(),
  evidence_urls: model.json().nullable(),
  status: model.enum([
    "submitted",
    "reviewing",
    "approved",
    "in_repair",
    "replaced",
    "denied",
    "closed",
  ]).default("submitted"),
  resolution_type: model.enum([
    "repair",
    "replace",
    "refund",
    "credit",
  ]).nullable(),
  resolution_notes: model.text().nullable(),
  approved_at: model.dateTime().nullable(),
  resolved_at: model.dateTime().nullable(),
  denied_reason: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default WarrantyClaim
