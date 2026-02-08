import { model } from "@medusajs/framework/utils"

const Reward = model.define("reward", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  reward_type: model.enum(["discount", "product", "service", "experience", "cashback", "upgrade"]),
  points_required: model.number(),
  value: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  available_quantity: model.number().nullable(),
  redeemed_count: model.number().default(0),
  min_tier_level: model.number().default(0),
  is_active: model.boolean().default(true),
  valid_from: model.dateTime().nullable(),
  valid_until: model.dateTime().nullable(),
  image_url: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Reward
