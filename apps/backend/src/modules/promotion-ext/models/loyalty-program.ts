import { model } from "@medusajs/framework/utils"

const LoyaltyProgram = model.define("loyalty_program", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text(),
  points_per_currency: model.number().default(1),
  currency_code: model.text(),
  tier_config: model.json(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default LoyaltyProgram
