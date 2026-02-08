import { model } from "@medusajs/framework/utils"

const ImpressionLog = model.define("impression_log", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  campaign_id: model.text(),
  creative_id: model.text(),
  placement_id: model.text().nullable(),
  viewer_id: model.text().nullable(),
  impression_type: model.enum([
    "view",
    "click",
    "conversion",
  ]),
  ip_address: model.text().nullable(),
  user_agent: model.text().nullable(),
  referrer: model.text().nullable(),
  revenue: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  occurred_at: model.dateTime(),
  metadata: model.json().nullable(),
})

export default ImpressionLog
