import { model } from "@medusajs/framework/utils"

const AdCreative = model.define("ad_creative", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  campaign_id: model.text(),
  placement_id: model.text().nullable(),
  creative_type: model.enum([
    "image",
    "video",
    "text",
    "html",
    "product_card",
  ]),
  title: model.text().nullable(),
  body_text: model.text().nullable(),
  image_url: model.text().nullable(),
  video_url: model.text().nullable(),
  click_url: model.text(),
  cta_text: model.text().nullable(),
  product_ids: model.json().nullable(),
  is_approved: model.boolean().default(false),
  approved_by: model.text().nullable(),
  approved_at: model.dateTime().nullable(),
  rejection_reason: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default AdCreative
