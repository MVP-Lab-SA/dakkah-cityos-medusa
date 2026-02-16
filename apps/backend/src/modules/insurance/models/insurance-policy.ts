import { model } from "@medusajs/framework/utils"

const InsurancePolicy = model.define("ins_policy", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  product_id: model.text(),
  order_id: model.text().nullable(),
  plan_type: model.text(),
  coverage_amount: model.bigNumber(),
  premium: model.bigNumber(),
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  status: model.enum(["active", "expired", "cancelled", "claimed"]).default("active"),
  policy_number: model.text(),
  cancellation_reason: model.text().nullable(),
  cancelled_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default InsurancePolicy
