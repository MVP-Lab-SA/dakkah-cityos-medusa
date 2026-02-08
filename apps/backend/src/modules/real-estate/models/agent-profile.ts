import { model } from "@medusajs/framework/utils"

const AgentProfile = model.define("agent_profile", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  user_id: model.text().nullable(),
  name: model.text(),
  email: model.text(),
  phone: model.text().nullable(),
  license_number: model.text().nullable(),
  agency_name: model.text().nullable(),
  specializations: model.json().nullable(),
  bio: model.text().nullable(),
  photo_url: model.text().nullable(),
  total_listings: model.number().default(0),
  total_sales: model.number().default(0),
  avg_rating: model.number().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default AgentProfile
