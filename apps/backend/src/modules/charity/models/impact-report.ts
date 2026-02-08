import { model } from "@medusajs/framework/utils"

const ImpactReport = model.define("impact_report", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  charity_id: model.text(),
  campaign_id: model.text().nullable(),
  title: model.text(),
  content: model.text(),
  report_period_start: model.dateTime(),
  report_period_end: model.dateTime(),
  metrics: model.json().nullable(),
  images: model.json().nullable(),
  is_published: model.boolean().default(false),
  published_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default ImpactReport
