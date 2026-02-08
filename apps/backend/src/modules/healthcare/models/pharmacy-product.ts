import { model } from "@medusajs/framework/utils"

const PharmacyProduct = model.define("pharmacy_product", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  product_id: model.text().nullable(),
  name: model.text(),
  generic_name: model.text().nullable(),
  manufacturer: model.text().nullable(),
  dosage_form: model.enum(["tablet", "capsule", "liquid", "injection", "topical", "inhaler", "patch", "other"]),
  strength: model.text().nullable(),
  requires_prescription: model.boolean().default(false),
  controlled_substance_schedule: model.text().nullable(),
  storage_instructions: model.text().nullable(),
  side_effects: model.json().nullable(),
  contraindications: model.json().nullable(),
  price: model.bigNumber(),
  currency_code: model.text(),
  stock_quantity: model.number().default(0),
  expiry_date: model.dateTime().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default PharmacyProduct
