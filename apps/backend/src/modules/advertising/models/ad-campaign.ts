import { model } from "@medusajs/framework/utils"

const AdCampaign = model.define("ad_campaign", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  advertiser_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  campaign_type: model.enum([
    "sponsored_listing",
    "banner",
    "search",
    "social",
    "email",
  ]),
  status: model.enum([
    "draft",
    "pending_review",
    "active",
    "paused",
    "completed",
    "rejected",
  ]).default("draft"),
  budget: model.bigNumber(),
  spent: model.bigNumber().default(0),
  currency_code: model.text(),
  daily_budget: model.bigNumber().nullable(),
  bid_type: model.enum([
    "cpc",
    "cpm",
    "cpa",
    "flat",
  ]).default("cpc"),
  bid_amount: model.bigNumber().nullable(),
  targeting: model.json().nullable(),
  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime().nullable(),
  total_impressions: model.number().default(0),
  total_clicks: model.number().default(0),
  total_conversions: model.number().default(0),
  metadata: model.json().nullable(),
})

export default AdCampaign
