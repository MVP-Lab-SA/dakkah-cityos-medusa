import { model } from "@medusajs/framework/utils"

const CrowdfundCampaign = model.define("crowdfund_campaign", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  creator_id: model.text(),
  title: model.text(),
  description: model.text(),
  short_description: model.text().nullable(),
  campaign_type: model.enum(["reward", "equity", "donation", "debt"]),
  status: model.enum([
    "draft",
    "pending_review",
    "active",
    "funded",
    "failed",
    "cancelled",
  ]).default("draft"),
  goal_amount: model.bigNumber(),
  raised_amount: model.bigNumber().default(0),
  currency_code: model.text(),
  backer_count: model.number().default(0),
  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime(),
  is_flexible_funding: model.boolean().default(false),
  category: model.text().nullable(),
  images: model.json().nullable(),
  video_url: model.text().nullable(),
  risks_and_challenges: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default CrowdfundCampaign
