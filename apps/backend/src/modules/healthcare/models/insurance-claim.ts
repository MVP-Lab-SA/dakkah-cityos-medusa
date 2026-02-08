import { model } from "@medusajs/framework/utils"

const InsuranceClaim = model.define("insurance_claim", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  patient_id: model.text(),
  appointment_id: model.text().nullable(),
  claim_number: model.text().unique(),
  insurance_provider: model.text(),
  policy_number: model.text(),
  claim_amount: model.bigNumber(),
  approved_amount: model.bigNumber().nullable(),
  currency_code: model.text(),
  status: model.enum(["submitted", "under_review", "approved", "partially_approved", "denied", "paid"]).default("submitted"),
  diagnosis_codes: model.json().nullable(),
  procedure_codes: model.json().nullable(),
  submitted_at: model.dateTime(),
  reviewed_at: model.dateTime().nullable(),
  denial_reason: model.text().nullable(),
  paid_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default InsuranceClaim
