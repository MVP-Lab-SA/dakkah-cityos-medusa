import { model } from "@medusajs/framework/utils"

const BatchTracking = model.define("batch_tracking", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  product_id: model.text(),
  batch_number: model.text(),
  supplier: model.text().nullable(),
  received_date: model.dateTime(),
  expiry_date: model.dateTime(),
  quantity_received: model.number(),
  quantity_remaining: model.number(),
  unit_cost: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  status: model.enum([
    "active",
    "low_stock",
    "expiring_soon",
    "expired",
    "recalled",
  ]).default("active"),
  storage_location: model.text().nullable(),
  temperature_log: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default BatchTracking
