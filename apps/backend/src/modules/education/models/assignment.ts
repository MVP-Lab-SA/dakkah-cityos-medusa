import { model } from "@medusajs/framework/utils"

const Assignment = model.define("assignment", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  course_id: model.text(),
  lesson_id: model.text().nullable(),
  student_id: model.text(),
  title: model.text(),
  instructions: model.text().nullable(),
  submission_url: model.text().nullable(),
  submission_text: model.text().nullable(),
  submitted_at: model.dateTime().nullable(),
  status: model.enum(["pending", "submitted", "grading", "graded", "resubmit_requested"]).default("pending"),
  grade: model.number().nullable(),
  max_grade: model.number().default(100),
  feedback: model.text().nullable(),
  graded_by: model.text().nullable(),
  graded_at: model.dateTime().nullable(),
  due_date: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default Assignment
