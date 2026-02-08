import { model } from "@medusajs/framework/utils"

const Affiliate = model.define("affiliate", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text().nullable(),
  name: model.text(),
  email: model.text(),
  affiliate_type: model.enum([
    "standard",
    "influencer",
    "partner",
    "ambassador",
  ]),
  status: model.enum([
    "pending",
    "approved",
    "active",
    "suspended",
    "terminated",
  ]).default("pending"),
  commission_rate: model.number(),
  commission_type: model.enum([
    "percentage",
    "flat",
  ]).default("percentage"),
  payout_method: model.enum([
    "bank_transfer",
    "paypal",
    "store_credit",
  ]).default("bank_transfer"),
  payout_minimum: model.bigNumber().default(5000),
  total_earnings: model.bigNumber().default(0),
  total_paid: model.bigNumber().default(0),
  total_clicks: model.number().default(0),
  total_conversions: model.number().default(0),
  bio: model.text().nullable(),
  social_links: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default Affiliate
