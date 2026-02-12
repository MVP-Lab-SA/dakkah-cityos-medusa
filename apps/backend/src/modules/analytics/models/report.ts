// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const Report = model.define("report", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  slug: model.text(),
  report_type: model.text(),
  date_range_type: model.text(),
  filters: model.json().nullable(),
  schedule: model.text().nullable(),
  last_generated: model.dateTime().nullable(),
  is_public: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default Report
