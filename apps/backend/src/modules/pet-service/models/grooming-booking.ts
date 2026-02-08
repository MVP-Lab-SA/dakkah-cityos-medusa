import { model } from "@medusajs/framework/utils"

const GroomingBooking = model.define("grooming_booking", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  pet_id: model.text(),
  owner_id: model.text(),
  provider_id: model.text().nullable(),
  service_type: model.enum([
    "bath",
    "haircut",
    "nail_trim",
    "teeth_cleaning",
    "full_grooming",
    "deshedding",
  ]),
  status: model.enum([
    "scheduled",
    "in_progress",
    "completed",
    "cancelled",
  ]).default("scheduled"),
  scheduled_at: model.dateTime(),
  duration_minutes: model.number().default(60),
  price: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  special_instructions: model.text().nullable(),
  completed_at: model.dateTime().nullable(),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default GroomingBooking
