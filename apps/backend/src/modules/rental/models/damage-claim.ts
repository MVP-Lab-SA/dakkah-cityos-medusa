import { model } from "@medusajs/framework/utils"

const DamageClaim = model.define("damage_claim", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  agreement_id: model.text(),
  return_id: model.text().nullable(),
  description: model.text(),
  evidence_urls: model.json().nullable(),
  estimated_cost: model.bigNumber().nullable(),
  actual_cost: model.bigNumber().nullable(),
  currency_code: model.text(),
  status: model.enum(["filed", "reviewing", "approved", "denied", "resolved"]).default("filed"),
  resolution_notes: model.text().nullable(),
  resolved_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default DamageClaim
