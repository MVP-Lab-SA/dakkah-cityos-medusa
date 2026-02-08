import { model } from "@medusajs/framework/utils"

const DeliverySlot = model.define("delivery_slot", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  slot_date: model.dateTime(),
  start_time: model.text(),
  end_time: model.text(),
  slot_type: model.enum(["standard", "express", "scheduled"]),
  max_orders: model.number(),
  current_orders: model.number().default(0),
  delivery_fee: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  is_available: model.boolean().default(true),
  cutoff_time: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default DeliverySlot
