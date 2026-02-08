import { model } from "@medusajs/framework/utils"

const TimeLog = model.define("time_log", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  contract_id: model.text(),
  freelancer_id: model.text(),
  description: model.text().nullable(),
  started_at: model.dateTime(),
  ended_at: model.dateTime().nullable(),
  duration_minutes: model.number().nullable(),
  hourly_rate: model.bigNumber().nullable(),
  total_amount: model.bigNumber().nullable(),
  currency_code: model.text(),
  is_billable: model.boolean().default(true),
  is_approved: model.boolean().default(false),
  approved_by: model.text().nullable(),
  screenshot_url: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default TimeLog
