import { model } from "@medusajs/framework/utils"

const UtilityAccount = model.define("utility_account", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text(),
  utility_type: model.enum([
    "electricity",
    "water",
    "gas",
    "internet",
    "phone",
    "cable",
    "waste",
  ]),
  provider_name: model.text(),
  account_number: model.text(),
  meter_number: model.text().nullable(),
  address: model.json().nullable(),
  status: model.enum([
    "active",
    "suspended",
    "closed",
  ]).default("active"),
  auto_pay: model.boolean().default(false),
  payment_method_id: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default UtilityAccount
