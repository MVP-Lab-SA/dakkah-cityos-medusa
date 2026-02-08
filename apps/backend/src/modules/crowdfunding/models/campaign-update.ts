import { model } from "@medusajs/framework/utils"

const CampaignUpdate = model.define("campaign_update", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  campaign_id: model.text(),
  title: model.text(),
  content: model.text(),
  update_type: model.enum([
    "general",
    "milestone",
    "stretch_goal",
    "shipping",
    "delay",
  ]),
  is_public: model.boolean().default(true),
  media_urls: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default CampaignUpdate
