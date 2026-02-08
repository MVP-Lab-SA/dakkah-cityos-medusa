import { model } from "@medusajs/framework/utils"

const Practitioner = model.define("practitioner", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  user_id: model.text().nullable(),
  name: model.text(),
  title: model.text().nullable(),
  specialization: model.text(),
  license_number: model.text().nullable(),
  license_verified: model.boolean().default(false),
  bio: model.text().nullable(),
  education: model.json().nullable(),
  experience_years: model.number().nullable(),
  languages: model.json().nullable(),
  consultation_fee: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  consultation_duration_minutes: model.number().default(30),
  is_accepting_patients: model.boolean().default(true),
  rating: model.number().nullable(),
  total_reviews: model.number().default(0),
  photo_url: model.text().nullable(),
  availability: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default Practitioner
