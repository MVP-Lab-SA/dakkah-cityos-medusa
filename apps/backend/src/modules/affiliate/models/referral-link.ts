import { model } from "@medusajs/framework/utils"

const ReferralLink = model.define("referral_link", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  affiliate_id: model.text(),
  code: model.text().unique(),
  target_url: model.text(),
  campaign_name: model.text().nullable(),
  is_active: model.boolean().default(true),
  total_clicks: model.number().default(0),
  total_conversions: model.number().default(0),
  total_revenue: model.bigNumber().default(0),
  metadata: model.json().nullable(),
})

export default ReferralLink
