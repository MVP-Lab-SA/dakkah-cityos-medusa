import { model } from "@medusajs/framework/utils"

const CitizenProfile = model.define("citizen_profile", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text().nullable(),
  national_id: model.text().nullable(),
  full_name: model.text(),
  date_of_birth: model.dateTime().nullable(),
  address: model.json().nullable(),
  phone: model.text().nullable(),
  email: model.text().nullable(),
  preferred_language: model.text().default("en"),
  registered_services: model.json().nullable(),
  total_requests: model.number().default(0),
  metadata: model.json().nullable(),
})

export default CitizenProfile
