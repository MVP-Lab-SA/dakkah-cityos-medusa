import { model } from "@medusajs/framework/utils"

const UsageRecord = model.define("usage_record", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  account_id: model.text(),
  period_start: model.dateTime(),
  period_end: model.dateTime(),
  usage_value: model.number(),
  unit: model.text(),
  usage_type: model.enum([
    "consumption",
    "peak",
    "off_peak",
    "reactive",
  ]),
  cost: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  tier: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default UsageRecord
