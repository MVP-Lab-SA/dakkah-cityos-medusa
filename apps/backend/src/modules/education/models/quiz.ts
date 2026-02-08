import { model } from "@medusajs/framework/utils"

const Quiz = model.define("quiz", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  course_id: model.text(),
  lesson_id: model.text().nullable(),
  title: model.text(),
  description: model.text().nullable(),
  quiz_type: model.enum(["multiple_choice", "true_false", "short_answer", "mixed"]),
  questions: model.json(),
  passing_score: model.number().default(70),
  time_limit_minutes: model.number().nullable(),
  max_attempts: model.number().default(3),
  is_randomized: model.boolean().default(false),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default Quiz
