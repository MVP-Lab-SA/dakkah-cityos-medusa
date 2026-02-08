import { model } from "@medusajs/framework/utils"

const MembershipTier = model.define("membership_tier", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  tier_level: model.number(),
  min_points: model.number().default(0),
  annual_fee: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  benefits: model.json().nullable(),
  perks: model.json().nullable(),
  upgrade_threshold: model.number().nullable(),
  downgrade_threshold: model.number().nullable(),
  color_code: model.text().nullable(),
  icon_url: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default MembershipTier
