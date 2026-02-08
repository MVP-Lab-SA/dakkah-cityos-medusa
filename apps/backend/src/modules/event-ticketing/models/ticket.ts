import { model } from "@medusajs/framework/utils"

const Ticket = model.define("ticket", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  event_id: model.text(),
  ticket_type_id: model.text(),
  order_id: model.text().nullable(),
  customer_id: model.text(),
  attendee_name: model.text().nullable(),
  attendee_email: model.text().nullable(),
  barcode: model.text().unique(),
  qr_data: model.text().nullable(),
  status: model.enum([
    "valid",
    "used",
    "cancelled",
    "refunded",
    "transferred",
  ]).default("valid"),
  seat_info: model.json().nullable(),
  checked_in_at: model.dateTime().nullable(),
  transferred_to: model.text().nullable(),
  transferred_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default Ticket
