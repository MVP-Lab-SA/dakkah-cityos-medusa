import { model } from "@medusajs/framework/utils"

const CharityOrg = model.define("charity_org", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  registration_number: model.text().nullable(),
  category: model.enum([
    "education",
    "health",
    "environment",
    "poverty",
    "disaster",
    "animal",
    "arts",
    "community",
    "other",
  ]),
  website: model.text().nullable(),
  email: model.text().nullable(),
  phone: model.text().nullable(),
  address: model.json().nullable(),
  logo_url: model.text().nullable(),
  is_verified: model.boolean().default(false),
  verified_at: model.dateTime().nullable(),
  tax_deductible: model.boolean().default(false),
  total_raised: model.bigNumber().default(0),
  currency_code: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default CharityOrg
