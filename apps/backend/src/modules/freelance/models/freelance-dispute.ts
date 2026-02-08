import { model } from "@medusajs/framework/utils"

const FreelanceDispute = model.define("freelance_dispute", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  contract_id: model.text(),
  filed_by: model.text(),
  filed_against: model.text(),
  reason: model.enum(["non_delivery", "quality", "payment", "scope_creep", "communication", "other"]),
  description: model.text(),
  evidence_urls: model.json().nullable(),
  status: model.enum(["filed", "mediation", "escalated", "resolved", "closed"]).default("filed"),
  resolution: model.text().nullable(),
  resolved_by: model.text().nullable(),
  resolved_at: model.dateTime().nullable(),
  refund_amount: model.bigNumber().nullable(),
  metadata: model.json().nullable(),
})

export default FreelanceDispute
