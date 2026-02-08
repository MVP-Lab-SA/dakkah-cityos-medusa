import { model } from "@medusajs/framework/utils"

const SocialShare = model.define("social_share", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  product_id: model.text(),
  sharer_id: model.text(),
  platform: model.enum([
    "whatsapp",
    "instagram",
    "facebook",
    "twitter",
    "tiktok",
    "email",
    "copy_link",
  ]),
  share_url: model.text().nullable(),
  click_count: model.number().default(0),
  conversion_count: model.number().default(0),
  revenue_generated: model.bigNumber().default(0),
  shared_at: model.dateTime(),
  metadata: model.json().nullable(),
})

export default SocialShare
