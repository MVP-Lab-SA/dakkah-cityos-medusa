import { model } from "@medusajs/framework/utils"

const InsuranceProduct = model.define("insurance_product", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  insurance_type: model.enum([
    "health",
    "life",
    "auto",
    "home",
    "travel",
    "business",
    "pet",
    "device",
  ]),
  coverage_details: model.json().nullable(),
  min_premium: model.bigNumber().nullable(),
  max_premium: model.bigNumber().nullable(),
  currency_code: model.text(),
  deductible_options: model.json().nullable(),
  term_options: model.json().nullable(),
  claim_process: model.text().nullable(),
  exclusions: model.json().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default InsuranceProduct
