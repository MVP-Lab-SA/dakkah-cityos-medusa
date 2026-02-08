import { model } from "@medusajs/framework/utils"

const TrainerProfile = model.define("trainer_profile", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  user_id: model.text().nullable(),
  name: model.text(),
  specializations: model.json().nullable(),
  certifications: model.json().nullable(),
  bio: model.text().nullable(),
  experience_years: model.number().nullable(),
  hourly_rate: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  is_accepting_clients: model.boolean().default(true),
  rating: model.number().nullable(),
  total_sessions: model.number().default(0),
  photo_url: model.text().nullable(),
  availability: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default TrainerProfile
