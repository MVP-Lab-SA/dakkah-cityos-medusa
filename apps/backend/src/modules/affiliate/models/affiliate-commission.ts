import { model } from "@medusajs/framework/utils"

const AffiliateCommission = model.define("affiliate_commission", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  affiliate_id: model.text(),
  order_id: model.text(),
  click_id: model.text().nullable(),
  order_amount: model.bigNumber(),
  commission_amount: model.bigNumber(),
  currency_code: model.text(),
  status: model.enum([
    "pending",
    "approved",
    "paid",
    "rejected",
  ]).default("pending"),
  approved_at: model.dateTime().nullable(),
  paid_at: model.dateTime().nullable(),
  payout_id: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default AffiliateCommission
