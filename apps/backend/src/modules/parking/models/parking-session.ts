import { model } from "@medusajs/framework/utils"

const ParkingSession = model.define("parking_session", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  zone_id: model.text(),
  customer_id: model.text().nullable(),
  vehicle_plate: model.text().nullable(),
  spot_number: model.text().nullable(),
  status: model.enum([
    "active",
    "completed",
    "expired",
    "cancelled",
  ]).default("active"),
  started_at: model.dateTime(),
  ended_at: model.dateTime().nullable(),
  duration_minutes: model.number().nullable(),
  amount: model.bigNumber().nullable(),
  currency_code: model.text(),
  payment_status: model.enum([
    "pending",
    "paid",
    "failed",
  ]).default("pending"),
  payment_reference: model.text().nullable(),
  is_ev_charging: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default ParkingSession
