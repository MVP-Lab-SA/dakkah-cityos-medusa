import { model } from "@medusajs/framework/utils"

const ClassBooking = model.define("class_booking", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  schedule_id: model.text(),
  customer_id: model.text(),
  status: model.enum([
    "booked",
    "checked_in",
    "completed",
    "cancelled",
    "no_show",
  ]).default("booked"),
  booked_at: model.dateTime(),
  checked_in_at: model.dateTime().nullable(),
  cancelled_at: model.dateTime().nullable(),
  cancellation_reason: model.text().nullable(),
  waitlist_position: model.number().nullable(),
  metadata: model.json().nullable(),
})

export default ClassBooking
