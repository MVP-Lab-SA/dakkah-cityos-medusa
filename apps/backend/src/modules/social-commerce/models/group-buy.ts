import { model } from "@medusajs/framework/utils"

const GroupBuy = model.define("group_buy", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  product_id: model.text(),
  organizer_id: model.text().nullable(),
  title: model.text(),
  description: model.text().nullable(),
  status: model.enum([
    "forming",
    "active",
    "succeeded",
    "failed",
    "cancelled",
  ]).default("forming"),
  target_quantity: model.number(),
  current_quantity: model.number().default(0),
  original_price: model.bigNumber(),
  group_price: model.bigNumber(),
  currency_code: model.text(),
  min_participants: model.number().default(2),
  max_participants: model.number().nullable(),
  starts_at: model.dateTime(),
  ends_at: model.dateTime(),
  metadata: model.json().nullable(),
})

export default GroupBuy
