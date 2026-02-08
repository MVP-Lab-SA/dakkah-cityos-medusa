import { model } from "@medusajs/framework/utils"

const Modifier = model.define("modifier", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  group_id: model.text(),
  name: model.text(),
  price_adjustment: model.bigNumber().default(0),
  currency_code: model.text(),
  is_available: model.boolean().default(true),
  is_default: model.boolean().default(false),
  calories: model.number().nullable(),
  display_order: model.number().default(0),
  metadata: model.json().nullable(),
})

export default Modifier
