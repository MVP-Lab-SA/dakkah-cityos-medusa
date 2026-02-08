import { model } from "@medusajs/framework/utils"

const PartCatalog = model.define("part_catalog", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  part_number: model.text(),
  oem_number: model.text().nullable(),
  description: model.text().nullable(),
  category: model.text().nullable(),
  compatible_makes: model.json().nullable(),
  compatible_models: model.json().nullable(),
  compatible_years: model.json().nullable(),
  price: model.bigNumber(),
  currency_code: model.text(),
  stock_quantity: model.number().default(0),
  condition: model.enum(["new", "refurbished", "used"]).default("new"),
  weight_kg: model.number().nullable(),
  dimensions: model.json().nullable(),
  supplier: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default PartCatalog
