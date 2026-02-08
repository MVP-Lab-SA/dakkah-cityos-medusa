import { model } from "@medusajs/framework/utils"

const ListingFlag = model.define("listing_flag", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  listing_id: model.text(),
  reporter_id: model.text(),
  reason: model.enum([
    "spam",
    "inappropriate",
    "scam",
    "prohibited",
    "duplicate",
    "other",
  ]),
  description: model.text().nullable(),
  status: model.enum([
    "pending",
    "reviewed",
    "actioned",
    "dismissed",
  ]).default("pending"),
  reviewed_by: model.text().nullable(),
  reviewed_at: model.dateTime().nullable(),
  action_taken: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default ListingFlag
