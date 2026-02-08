import { model } from "@medusajs/framework/utils"

const AttorneyProfile = model.define("attorney_profile", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  user_id: model.text().nullable(),
  name: model.text(),
  bar_number: model.text().nullable(),
  specializations: model.json().nullable(),
  practice_areas: model.json().nullable(),
  bio: model.text().nullable(),
  education: model.json().nullable(),
  experience_years: model.number().nullable(),
  hourly_rate: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  is_accepting_cases: model.boolean().default(true),
  rating: model.number().nullable(),
  total_cases: model.number().default(0),
  photo_url: model.text().nullable(),
  languages: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default AttorneyProfile
