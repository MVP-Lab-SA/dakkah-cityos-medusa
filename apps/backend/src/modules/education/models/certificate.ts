import { model } from "@medusajs/framework/utils"

const Certificate = model.define("certificate", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  enrollment_id: model.text(),
  course_id: model.text(),
  student_id: model.text(),
  certificate_number: model.text().unique(),
  title: model.text(),
  issued_at: model.dateTime(),
  expires_at: model.dateTime().nullable(),
  credential_url: model.text().nullable(),
  verification_code: model.text().nullable(),
  skills: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default Certificate
