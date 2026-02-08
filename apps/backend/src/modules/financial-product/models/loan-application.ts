import { model } from "@medusajs/framework/utils"

const LoanApplication = model.define("loan_application", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  loan_product_id: model.text(),
  applicant_id: model.text(),
  application_number: model.text().unique(),
  requested_amount: model.bigNumber(),
  approved_amount: model.bigNumber().nullable(),
  currency_code: model.text(),
  term_months: model.number(),
  interest_rate: model.number().nullable(),
  monthly_payment: model.bigNumber().nullable(),
  status: model.enum([
    "draft",
    "submitted",
    "under_review",
    "approved",
    "disbursed",
    "rejected",
    "cancelled",
  ]).default("draft"),
  purpose: model.text().nullable(),
  income_details: model.json().nullable(),
  documents: model.json().nullable(),
  credit_score: model.number().nullable(),
  submitted_at: model.dateTime().nullable(),
  approved_at: model.dateTime().nullable(),
  approved_by: model.text().nullable(),
  disbursed_at: model.dateTime().nullable(),
  rejection_reason: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default LoanApplication
