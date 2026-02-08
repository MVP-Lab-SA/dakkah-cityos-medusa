import { model } from "@medusajs/framework/utils"

const RentalPeriod = model.define("rental_period", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  rental_product_id: model.text(),
  period_type: model.enum(["peak", "off_peak", "holiday", "custom"]),
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  price_multiplier: model.number().default(1.0),
  is_blocked: model.boolean().default(false),
  reason: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default RentalPeriod
