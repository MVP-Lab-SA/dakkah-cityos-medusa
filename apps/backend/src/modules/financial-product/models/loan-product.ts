import { model } from "@medusajs/framework/utils"

const LoanProduct = model.define("loan_product", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  loan_type: model.enum([
    "personal",
    "business",
    "mortgage",
    "auto",
    "education",
    "micro",
  ]),
  min_amount: model.bigNumber(),
  max_amount: model.bigNumber(),
  currency_code: model.text(),
  interest_rate_min: model.number(),
  interest_rate_max: model.number(),
  interest_type: model.enum([
    "fixed",
    "variable",
    "reducing_balance",
  ]),
  min_term_months: model.number(),
  max_term_months: model.number(),
  processing_fee_pct: model.number().nullable(),
  requirements: model.json().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default LoanProduct
