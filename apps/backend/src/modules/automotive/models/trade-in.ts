import { model } from "@medusajs/framework/utils"

const TradeIn = model.define("trade_in", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text(),
  listing_id: model.text().nullable(),
  make: model.text(),
  model_name: model.text(),
  year: model.number(),
  mileage_km: model.number(),
  condition: model.enum(["excellent", "good", "fair", "poor"]),
  vin: model.text().nullable(),
  description: model.text().nullable(),
  photos: model.json().nullable(),
  estimated_value: model.bigNumber().nullable(),
  offered_value: model.bigNumber().nullable(),
  accepted_value: model.bigNumber().nullable(),
  currency_code: model.text(),
  status: model.enum(["submitted", "appraising", "offered", "accepted", "rejected", "completed"]).default("submitted"),
  appraised_by: model.text().nullable(),
  appraised_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default TradeIn
