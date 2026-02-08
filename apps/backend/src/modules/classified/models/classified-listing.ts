import { model } from "@medusajs/framework/utils"

const ClassifiedListing = model.define("classified_listing", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  seller_id: model.text(),
  title: model.text(),
  description: model.text(),
  category_id: model.text().nullable(),
  subcategory_id: model.text().nullable(),
  listing_type: model.enum([
    "sell",
    "buy",
    "trade",
    "free",
    "wanted",
  ]),
  condition: model.enum([
    "new",
    "like_new",
    "good",
    "fair",
    "poor",
  ]).default("good"),
  price: model.bigNumber().nullable(),
  currency_code: model.text(),
  is_negotiable: model.boolean().default(true),
  location_city: model.text().nullable(),
  location_state: model.text().nullable(),
  location_country: model.text().nullable(),
  latitude: model.number().nullable(),
  longitude: model.number().nullable(),
  status: model.enum([
    "draft",
    "active",
    "sold",
    "expired",
    "flagged",
    "removed",
  ]).default("draft"),
  view_count: model.number().default(0),
  favorite_count: model.number().default(0),
  expires_at: model.dateTime().nullable(),
  promoted_until: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default ClassifiedListing
