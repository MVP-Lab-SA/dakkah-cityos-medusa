import { model } from "@medusajs/framework/utils"

const MunicipalLicense = model.define("municipal_license", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  holder_id: model.text(),
  license_type: model.enum([
    "business",
    "trade",
    "professional",
    "vehicle",
    "pet",
    "firearm",
    "alcohol",
    "food_handling",
  ]),
  license_number: model.text().unique(),
  status: model.enum([
    "active",
    "expired",
    "suspended",
    "revoked",
  ]).default("active"),
  issued_at: model.dateTime(),
  expires_at: model.dateTime().nullable(),
  renewal_date: model.dateTime().nullable(),
  fee: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  conditions: model.json().nullable(),
  issuing_authority: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default MunicipalLicense
