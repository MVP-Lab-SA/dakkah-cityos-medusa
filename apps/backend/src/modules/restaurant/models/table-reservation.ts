import { model } from "@medusajs/framework/utils"

const TableReservation = model.define("table_reservation", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  restaurant_id: model.text(),
  customer_id: model.text().nullable(),
  customer_name: model.text(),
  customer_phone: model.text(),
  customer_email: model.text().nullable(),
  party_size: model.number(),
  reservation_date: model.dateTime(),
  time_slot: model.text(),
  duration_minutes: model.number().default(90),
  status: model.enum(["pending", "confirmed", "seated", "completed", "no_show", "cancelled"]).default("pending"),
  special_requests: model.text().nullable(),
  table_number: model.text().nullable(),
  confirmed_at: model.dateTime().nullable(),
  cancelled_at: model.dateTime().nullable(),
  cancellation_reason: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default TableReservation
