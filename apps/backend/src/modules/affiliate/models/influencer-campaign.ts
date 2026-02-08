import { model } from "@medusajs/framework/utils"

const InfluencerCampaign = model.define("influencer_campaign", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  affiliate_id: model.text(),
  status: model.enum([
    "draft",
    "active",
    "paused",
    "completed",
  ]).default("draft"),
  campaign_type: model.enum([
    "sponsored_post",
    "review",
    "unboxing",
    "tutorial",
    "giveaway",
  ]),
  budget: model.bigNumber().nullable(),
  currency_code: model.text(),
  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime().nullable(),
  deliverables: model.json().nullable(),
  performance_metrics: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default InfluencerCampaign
