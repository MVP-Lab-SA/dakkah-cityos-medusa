import { model } from "@medusajs/framework/utils"

const UtilityBill = model.define("utility_bill", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  account_id: model.text(),
  bill_number: model.text().unique(),
  billing_period_start: model.dateTime(),
  billing_period_end: model.dateTime(),
  due_date: model.dateTime(),
  amount: model.bigNumber(),
  currency_code: model.text(),
  consumption: model.number().nullable(),
  consumption_unit: model.text().nullable(),
  status: model.enum([
    "generated",
    "sent",
    "paid",
    "overdue",
    "disputed",
  ]).default("generated"),
  paid_at: model.dateTime().nullable(),
  payment_reference: model.text().nullable(),
  late_fee: model.bigNumber().nullable(),
  metadata: model.json().nullable(),
})

export default UtilityBill
