import { model } from "@medusajs/framework/utils"

const AdAccount = model.define("ad_account", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  advertiser_id: model.text(),
  account_name: model.text(),
  balance: model.bigNumber().default(0),
  currency_code: model.text(),
  total_spent: model.bigNumber().default(0),
  total_deposited: model.bigNumber().default(0),
  status: model.enum([
    "active",
    "suspended",
    "closed",
  ]).default("active"),
  auto_recharge: model.boolean().default(false),
  auto_recharge_amount: model.bigNumber().nullable(),
  auto_recharge_threshold: model.bigNumber().nullable(),
  metadata: model.json().nullable(),
})

export default AdAccount
