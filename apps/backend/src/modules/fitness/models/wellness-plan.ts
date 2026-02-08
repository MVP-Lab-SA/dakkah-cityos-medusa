import { model } from "@medusajs/framework/utils"

const WellnessPlan = model.define("wellness_plan", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text(),
  trainer_id: model.text().nullable(),
  title: model.text(),
  plan_type: model.enum([
    "fitness",
    "nutrition",
    "weight_loss",
    "muscle_gain",
    "flexibility",
    "rehabilitation",
    "holistic",
  ]),
  status: model.enum([
    "active",
    "completed",
    "paused",
    "cancelled",
  ]).default("active"),
  goals: model.json().nullable(),
  duration_weeks: model.number().nullable(),
  workout_schedule: model.json().nullable(),
  nutrition_guidelines: model.json().nullable(),
  progress_notes: model.json().nullable(),
  start_date: model.dateTime(),
  end_date: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default WellnessPlan
