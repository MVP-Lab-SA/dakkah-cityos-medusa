import { model } from "@medusajs/framework/utils"

const RewardTier = model.define("reward_tier", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  campaign_id: model.text(),
  title: model.text(),
  description: model.text().nullable(),
  pledge_amount: model.bigNumber(),
  currency_code: model.text(),
  quantity_available: model.number().nullable(),
  quantity_claimed: model.number().default(0),
  estimated_delivery: model.dateTime().nullable(),
  includes: model.json().nullable(),
  shipping_type: model.enum(["none", "domestic", "international"]).default("none"),
  image_url: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default RewardTier
