import { model } from "@medusajs/framework/utils"

const Room = model.define("room", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  property_id: model.text(),
  room_type_id: model.text(),
  room_number: model.text(),
  floor: model.text().nullable(),
  status: model.enum(["available", "occupied", "maintenance", "out_of_order"]).default("available"),
  is_smoking: model.boolean().default(false),
  is_accessible: model.boolean().default(false),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Room
