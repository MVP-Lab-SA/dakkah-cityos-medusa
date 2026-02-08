import { model } from "@medusajs/framework/utils"

const Pledge = model.define("pledge", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  campaign_id: model.text(),
  backer_id: model.text(),
  reward_tier_id: model.text().nullable(),
  amount: model.bigNumber(),
  currency_code: model.text(),
  status: model.enum([
    "pending",
    "confirmed",
    "fulfilled",
    "refunded",
    "cancelled",
  ]).default("pending"),
  payment_reference: model.text().nullable(),
  anonymous: model.boolean().default(false),
  message: model.text().nullable(),
  fulfilled_at: model.dateTime().nullable(),
  refunded_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default Pledge
