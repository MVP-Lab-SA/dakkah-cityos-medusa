import { model } from "@medusajs/framework/utils"

const KitchenOrder = model.define("kitchen_order", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  restaurant_id: model.text(),
  order_id: model.text(),
  station: model.text().nullable(),
  status: model.enum(["received", "preparing", "ready", "picked_up", "cancelled"]).default("received"),
  priority: model.enum(["normal", "rush", "scheduled"]).default("normal"),
  items: model.json(),
  notes: model.text().nullable(),
  estimated_prep_time: model.number().nullable(),
  actual_prep_time: model.number().nullable(),
  started_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default KitchenOrder
