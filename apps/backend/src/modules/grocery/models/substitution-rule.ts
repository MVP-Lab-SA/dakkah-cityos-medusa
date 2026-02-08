import { model } from "@medusajs/framework/utils"

const SubstitutionRule = model.define("substitution_rule", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  original_product_id: model.text(),
  substitute_product_id: model.text(),
  priority: model.number().default(0),
  is_auto_substitute: model.boolean().default(false),
  price_match: model.boolean().default(true),
  max_price_difference_pct: model.number().nullable(),
  customer_approval_required: model.boolean().default(true),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default SubstitutionRule
