import { model } from "@medusajs/framework/utils"

const PetProduct = model.define("pet_product", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  product_id: model.text().nullable(),
  name: model.text(),
  category: model.enum([
    "food",
    "treats",
    "toys",
    "accessories",
    "health",
    "grooming",
    "housing",
  ]),
  species_tags: model.json().nullable(),
  breed_specific: model.text().nullable(),
  age_group: model.enum([
    "puppy_kitten",
    "adult",
    "senior",
    "all_ages",
  ]).default("all_ages"),
  weight_range: model.json().nullable(),
  ingredients: model.json().nullable(),
  nutritional_info: model.json().nullable(),
  is_prescription_required: model.boolean().default(false),
  price: model.bigNumber(),
  currency_code: model.text(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default PetProduct
