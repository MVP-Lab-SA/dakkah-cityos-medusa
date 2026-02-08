import { model } from "@medusajs/framework/utils"

const MedicalRecord = model.define("medical_record", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  patient_id: model.text(),
  record_type: model.enum(["consultation", "diagnosis", "procedure", "lab_result", "imaging", "vaccination", "allergy", "medication"]),
  practitioner_id: model.text().nullable(),
  appointment_id: model.text().nullable(),
  title: model.text(),
  description: model.text().nullable(),
  data: model.json().nullable(),
  attachments: model.json().nullable(),
  is_confidential: model.boolean().default(false),
  access_level: model.enum(["patient", "practitioner", "specialist", "admin"]).default("practitioner"),
  recorded_at: model.dateTime(),
  metadata: model.json().nullable(),
})

export default MedicalRecord
