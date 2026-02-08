import { model } from "@medusajs/framework/utils"

const GigListing = model.define("gig_listing", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  freelancer_id: model.text(),
  title: model.text(),
  description: model.text(),
  category: model.text().nullable(),
  subcategory: model.text().nullable(),
  listing_type: model.enum(["fixed_price", "hourly", "milestone"]),
  price: model.bigNumber().nullable(),
  hourly_rate: model.bigNumber().nullable(),
  currency_code: model.text(),
  delivery_time_days: model.number().nullable(),
  revisions_included: model.number().default(1),
  status: model.enum(["draft", "active", "paused", "completed", "suspended"]).default("draft"),
  skill_tags: model.json().nullable(),
  portfolio_urls: model.json().nullable(),
  total_orders: model.number().default(0),
  avg_rating: model.number().nullable(),
  metadata: model.json().nullable(),
})

export default GigListing
