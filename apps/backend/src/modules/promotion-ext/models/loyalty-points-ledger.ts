import { model } from "@medusajs/framework/utils"

const LoyaltyPointsLedger = model.define("loyalty_points_ledger", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text(),
  program_id: model.text(),
  transaction_type: model.enum(["earn", "redeem", "expire", "adjust", "bonus"]),
  points: model.number(),
  balance_after: model.number(),
  reference_type: model.text().nullable(),
  reference_id: model.text().nullable(),
  description: model.text().nullable(),
  expires_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default LoyaltyPointsLedger
