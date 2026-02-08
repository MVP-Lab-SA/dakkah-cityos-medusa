import { model } from "@medusajs/framework/utils"

const Donation = model.define("donation", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  campaign_id: model.text().nullable(),
  charity_id: model.text(),
  donor_id: model.text().nullable(),
  amount: model.bigNumber(),
  currency_code: model.text(),
  donation_type: model.enum([
    "one_time",
    "monthly",
    "annual",
  ]),
  status: model.enum([
    "pending",
    "completed",
    "failed",
    "refunded",
  ]).default("pending"),
  is_anonymous: model.boolean().default(false),
  donor_name: model.text().nullable(),
  donor_email: model.text().nullable(),
  message: model.text().nullable(),
  payment_reference: model.text().nullable(),
  tax_receipt_id: model.text().nullable(),
  recurring_id: model.text().nullable(),
  completed_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default Donation
