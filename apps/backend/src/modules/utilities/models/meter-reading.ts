import { model } from "@medusajs/framework/utils"

const MeterReading = model.define("meter_reading", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  account_id: model.text(),
  reading_value: model.number(),
  reading_date: model.dateTime(),
  reading_type: model.enum([
    "manual",
    "smart_meter",
    "estimated",
  ]),
  previous_reading: model.number().nullable(),
  consumption: model.number().nullable(),
  unit: model.text().nullable(),
  submitted_by: model.text().nullable(),
  is_verified: model.boolean().default(false),
  photo_url: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default MeterReading
