// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const Report = model.define("report", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  slug: model.text(),
  report_type: model.enum(["sales", "traffic", "conversion", "inventory", "customer", "vendor"]),
  date_range_type: model.enum(["today", "yesterday", "last_7_days", "last_30_days", "last_90_days", "custom"]),
  filters: model.json().nullable(),
  schedule: model.enum(["daily", "weekly", "monthly"]).nullable(),
  last_generated: model.dateTime().nullable(),
  is_public: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default Report
