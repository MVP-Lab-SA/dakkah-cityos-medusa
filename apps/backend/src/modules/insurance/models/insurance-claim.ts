import { model } from "@medusajs/framework/utils"

const InsuranceClaim = model.define("ins_claim", {
  id: model.id().primaryKey(),
  policy_id: model.text(),
  claim_type: model.text().nullable(),
  claim_amount: model.bigNumber(),
  description: model.text(),
  evidence: model.json().nullable(),
  status: model.enum(["pending", "under_review", "approved", "rejected"]).default("pending"),
  claim_number: model.text(),
  decision_notes: model.text().nullable(),
  payout_amount: model.bigNumber().nullable(),
  filed_at: model.dateTime().nullable(),
  decided_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default InsuranceClaim
