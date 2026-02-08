import { model } from "@medusajs/framework/utils"

const HealthcareAppointment = model.define("healthcare_appointment", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  practitioner_id: model.text(),
  patient_id: model.text(),
  appointment_type: model.enum(["consultation", "follow_up", "procedure", "lab_work", "vaccination", "screening"]),
  status: model.enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"]).default("scheduled"),
  scheduled_at: model.dateTime(),
  duration_minutes: model.number().default(30),
  is_virtual: model.boolean().default(false),
  virtual_link: model.text().nullable(),
  reason: model.text().nullable(),
  notes: model.text().nullable(),
  diagnosis_codes: model.json().nullable(),
  prescription_ids: model.json().nullable(),
  fee: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  insurance_claim_id: model.text().nullable(),
  confirmed_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  cancelled_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default HealthcareAppointment
