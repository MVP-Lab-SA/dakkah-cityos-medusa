import { model } from "@medusajs/framework/utils"

const RentalProduct = model.define("rental_product", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  product_id: model.text(),
  rental_type: model.enum(["daily", "weekly", "monthly", "hourly", "custom"]),
  base_price: model.bigNumber(),
  currency_code: model.text(),
  deposit_amount: model.bigNumber().nullable(),
  late_fee_per_day: model.bigNumber().nullable(),
  min_duration: model.number().default(1),
  max_duration: model.number().nullable(),
  is_available: model.boolean().default(true),
  condition_on_listing: model.enum(["new", "like_new", "good", "fair"]).default("new"),
  total_rentals: model.number().default(0),
  metadata: model.json().nullable(),
})

export default RentalProduct
