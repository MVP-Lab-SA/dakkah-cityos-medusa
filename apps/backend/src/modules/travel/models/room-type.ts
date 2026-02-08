import { model } from "@medusajs/framework/utils"

const RoomType = model.define("room_type", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  property_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  base_price: model.bigNumber(),
  currency_code: model.text(),
  max_occupancy: model.number(),
  bed_configuration: model.json().nullable(),
  room_size_sqm: model.number().nullable(),
  amenities: model.json().nullable(),
  images: model.json().nullable(),
  total_rooms: model.number().default(0),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default RoomType
