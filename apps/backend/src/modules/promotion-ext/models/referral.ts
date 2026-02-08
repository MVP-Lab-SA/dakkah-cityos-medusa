import { model } from "@medusajs/framework/utils"

const Referral = model.define("referral", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  referrer_customer_id: model.text(),
  referred_customer_id: model.text().nullable(),
  referral_code: model.text().unique(),
  status: model.enum(["pending", "completed", "expired", "revoked"]).default("pending"),
  reward_type: model.enum(["points", "discount", "credit"]),
  reward_value: model.number(),
  reward_given: model.boolean().default(false),
  expires_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default Referral
