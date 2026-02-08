import { model } from "@medusajs/framework/utils"

const ClassSchedule = model.define("class_schedule", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  facility_id: model.text().nullable(),
  class_name: model.text(),
  description: model.text().nullable(),
  class_type: model.enum([
    "yoga",
    "pilates",
    "hiit",
    "spinning",
    "boxing",
    "dance",
    "swimming",
    "crossfit",
    "meditation",
    "other",
  ]),
  instructor_id: model.text().nullable(),
  day_of_week: model.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  start_time: model.text(),
  end_time: model.text(),
  duration_minutes: model.number(),
  max_capacity: model.number(),
  current_enrollment: model.number().default(0),
  room: model.text().nullable(),
  difficulty: model.enum([
    "beginner",
    "intermediate",
    "advanced",
    "all_levels",
  ]).default("all_levels"),
  is_recurring: model.boolean().default(true),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default ClassSchedule
