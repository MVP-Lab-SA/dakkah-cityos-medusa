// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const LoyaltyAccount = model.define("loyalty_account", {
  id: model.id().primaryKey(),
  program_id: model.text(),
  customer_id: model.text(),
  tenant_id: model.text(),
  points_balance: model.bigNumber().default(0),
  lifetime_points: model.bigNumber().default(0),
  tier: model.text().nullable(),
  tier_expires_at: model.dateTime().nullable(),
  status: model.text().default("active"),
  metadata: model.json().nullable(),
})

export default LoyaltyAccount
