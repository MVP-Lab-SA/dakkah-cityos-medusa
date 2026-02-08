import { model } from "@medusajs/framework/utils"

const TravelReservation = model.define("travel_reservation", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  property_id: model.text(),
  room_type_id: model.text(),
  room_id: model.text().nullable(),
  guest_id: model.text(),
  order_id: model.text().nullable(),
  confirmation_number: model.text().unique(),
  check_in_date: model.dateTime(),
  check_out_date: model.dateTime(),
  nights: model.number(),
  adults: model.number().default(1),
  children: model.number().default(0),
  status: model.enum(["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"]).default("pending"),
  total_price: model.bigNumber(),
  currency_code: model.text(),
  special_requests: model.text().nullable(),
  cancelled_at: model.dateTime().nullable(),
  cancellation_reason: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default TravelReservation
