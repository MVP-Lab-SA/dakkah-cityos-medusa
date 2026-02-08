import { model } from "@medusajs/framework/utils"

const Membership = model.define("membership", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text(),
  tier_id: model.text(),
  membership_number: model.text().unique(),
  status: model.enum(["active", "expired", "suspended", "cancelled"]).default("active"),
  joined_at: model.dateTime(),
  expires_at: model.dateTime().nullable(),
  renewed_at: model.dateTime().nullable(),
  total_points: model.number().default(0),
  lifetime_points: model.number().default(0),
  total_spent: model.bigNumber().default(0),
  auto_renew: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default Membership
