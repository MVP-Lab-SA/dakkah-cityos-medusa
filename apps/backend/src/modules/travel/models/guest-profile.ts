import { model } from "@medusajs/framework/utils"

const GuestProfile = model.define("guest_profile", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text(),
  preferences: model.json().nullable(),
  loyalty_tier: model.text().nullable(),
  total_stays: model.number().default(0),
  total_nights: model.number().default(0),
  total_spent: model.bigNumber().default(0),
  nationality: model.text().nullable(),
  passport_number: model.text().nullable(),
  dietary_requirements: model.text().nullable(),
  special_needs: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default GuestProfile
