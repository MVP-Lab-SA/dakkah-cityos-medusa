import { model } from "@medusajs/framework/utils"

const DonationCampaign = model.define("donation_campaign", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  charity_id: model.text(),
  title: model.text(),
  description: model.text().nullable(),
  goal_amount: model.bigNumber().nullable(),
  raised_amount: model.bigNumber().default(0),
  currency_code: model.text(),
  donor_count: model.number().default(0),
  status: model.enum([
    "draft",
    "active",
    "completed",
    "cancelled",
  ]).default("draft"),
  campaign_type: model.enum([
    "one_time",
    "recurring",
    "emergency",
    "matching",
  ]),
  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime().nullable(),
  images: model.json().nullable(),
  updates: model.json().nullable(),
  is_featured: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default DonationCampaign
