import { model } from "@medusajs/framework/utils"

const SeatMap = model.define("seat_map", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  venue_id: model.text(),
  event_id: model.text().nullable(),
  name: model.text(),
  layout: model.json(),
  total_seats: model.number(),
  metadata: model.json().nullable(),
})

export default SeatMap
