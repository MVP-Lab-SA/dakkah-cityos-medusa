import { model } from "@medusajs/framework/utils"

const Enrollment = model.define("enrollment", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  course_id: model.text(),
  student_id: model.text(),
  order_id: model.text().nullable(),
  status: model.enum(["enrolled", "in_progress", "completed", "dropped", "expired"]).default("enrolled"),
  progress_pct: model.number().default(0),
  lessons_completed: model.number().default(0),
  enrolled_at: model.dateTime(),
  started_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  expires_at: model.dateTime().nullable(),
  certificate_id: model.text().nullable(),
  last_accessed_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default Enrollment
