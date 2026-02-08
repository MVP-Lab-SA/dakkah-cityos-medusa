import { model } from "@medusajs/framework/utils"

const VetAppointment = model.define("vet_appointment", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  pet_id: model.text(),
  owner_id: model.text(),
  vet_id: model.text().nullable(),
  clinic_name: model.text().nullable(),
  appointment_type: model.enum([
    "checkup",
    "vaccination",
    "emergency",
    "surgery",
    "dental",
    "follow_up",
  ]),
  status: model.enum([
    "scheduled",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
  ]).default("scheduled"),
  scheduled_at: model.dateTime(),
  duration_minutes: model.number().default(30),
  reason: model.text().nullable(),
  diagnosis: model.text().nullable(),
  treatment: model.text().nullable(),
  prescriptions: model.json().nullable(),
  cost: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  follow_up_date: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default VetAppointment
