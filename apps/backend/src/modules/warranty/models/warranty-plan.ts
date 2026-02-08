import { model } from "@medusajs/framework/utils"

const WarrantyPlan = model.define("warranty_plan", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  plan_type: model.enum([
    "standard",
    "extended",
    "premium",
    "accidental",
  ]),
  duration_months: model.number(),
  price: model.bigNumber().nullable(),
  currency_code: model.text(),
  coverage: model.json(),
  exclusions: model.json().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default WarrantyPlan
