import { model } from "@medusajs/framework/utils"

const Redemption = model.define("redemption", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  membership_id: model.text(),
  reward_id: model.text(),
  points_spent: model.number(),
  status: model.enum(["pending", "fulfilled", "cancelled", "expired"]).default("pending"),
  redemption_code: model.text().nullable(),
  fulfilled_at: model.dateTime().nullable(),
  expires_at: model.dateTime().nullable(),
  order_id: model.text().nullable(),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Redemption
