import { model } from "@medusajs/framework/utils"

const RentalAgreement = model.define("rental_agreement", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  rental_product_id: model.text(),
  customer_id: model.text(),
  order_id: model.text().nullable(),
  status: model.enum(["pending", "active", "overdue", "returned", "cancelled"]).default("pending"),
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  actual_return_date: model.dateTime().nullable(),
  total_price: model.bigNumber(),
  deposit_paid: model.bigNumber().nullable(),
  deposit_refunded: model.bigNumber().nullable(),
  late_fees: model.bigNumber().nullable(),
  currency_code: model.text(),
  terms_accepted: model.boolean().default(false),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default RentalAgreement
