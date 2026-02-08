import { model } from "@medusajs/framework/utils"

const AdPlacement = model.define("ad_placement", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  placement_type: model.enum([
    "homepage_banner",
    "category_page",
    "search_results",
    "product_page",
    "sidebar",
    "footer",
    "email",
    "push",
  ]),
  dimensions: model.json().nullable(),
  max_ads: model.number().default(1),
  price_per_day: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default AdPlacement
