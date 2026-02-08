import { model } from "@medusajs/framework/utils"

const RetainerAgreement = model.define("retainer_agreement", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  attorney_id: model.text(),
  client_id: model.text(),
  case_id: model.text().nullable(),
  agreement_number: model.text().unique(),
  status: model.enum([
    "draft",
    "active",
    "expired",
    "terminated",
  ]).default("draft"),
  retainer_amount: model.bigNumber(),
  currency_code: model.text(),
  billing_cycle: model.enum([
    "monthly",
    "quarterly",
    "annually",
  ]),
  hours_included: model.number().nullable(),
  hourly_overage_rate: model.bigNumber().nullable(),
  start_date: model.dateTime(),
  end_date: model.dateTime().nullable(),
  auto_renew: model.boolean().default(false),
  balance_remaining: model.bigNumber().default(0),
  total_billed: model.bigNumber().default(0),
  terms: model.json().nullable(),
  signed_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default RetainerAgreement
