import { model } from "@medusajs/framework/utils"

const Prescription = model.define("prescription", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  practitioner_id: model.text(),
  patient_id: model.text(),
  appointment_id: model.text().nullable(),
  prescription_number: model.text().unique(),
  status: model.enum(["issued", "dispensed", "partially_dispensed", "expired", "cancelled"]).default("issued"),
  medications: model.json(),
  diagnosis: model.text().nullable(),
  notes: model.text().nullable(),
  issued_at: model.dateTime(),
  valid_until: model.dateTime().nullable(),
  dispensed_at: model.dateTime().nullable(),
  dispensed_by: model.text().nullable(),
  pharmacy_id: model.text().nullable(),
  is_refillable: model.boolean().default(false),
  refill_count: model.number().default(0),
  max_refills: model.number().default(0),
  metadata: model.json().nullable(),
})

export default Prescription
