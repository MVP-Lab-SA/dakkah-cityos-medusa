import { model } from "@medusajs/framework/utils"

const PointsLedger = model.define("points_ledger", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  membership_id: model.text(),
  transaction_type: model.enum(["earn", "redeem", "expire", "adjust", "bonus", "transfer"]),
  points: model.number(),
  balance_after: model.number(),
  source: model.enum(["purchase", "review", "referral", "promotion", "manual", "birthday", "sign_up"]),
  reference_type: model.text().nullable(),
  reference_id: model.text().nullable(),
  description: model.text().nullable(),
  expires_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default PointsLedger
