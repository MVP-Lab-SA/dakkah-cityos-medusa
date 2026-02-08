import { model } from "@medusajs/framework/utils"

const Lesson = model.define("lesson", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  course_id: model.text(),
  title: model.text(),
  description: model.text().nullable(),
  content_type: model.enum(["video", "text", "quiz", "assignment", "live_session", "download"]),
  content_url: model.text().nullable(),
  content_body: model.text().nullable(),
  duration_minutes: model.number().nullable(),
  display_order: model.number().default(0),
  is_free_preview: model.boolean().default(false),
  is_mandatory: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default Lesson
