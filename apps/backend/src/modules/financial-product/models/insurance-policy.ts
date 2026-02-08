import { model } from "@medusajs/framework/utils"

const InsurancePolicy = model.define("insurance_policy", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  product_id: model.text(),
  holder_id: model.text(),
  policy_number: model.text().unique(),
  status: model.enum([
    "pending",
    "active",
    "lapsed",
    "cancelled",
    "expired",
    "claimed",
  ]).default("pending"),
  premium_amount: model.bigNumber(),
  currency_code: model.text(),
  payment_frequency: model.enum([
    "monthly",
    "quarterly",
    "annually",
  ]),
  coverage_amount: model.bigNumber(),
  deductible: model.bigNumber().nullable(),
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  beneficiaries: model.json().nullable(),
  documents: model.json().nullable(),
  auto_renew: model.boolean().default(true),
  last_payment_at: model.dateTime().nullable(),
  next_payment_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default InsurancePolicy
