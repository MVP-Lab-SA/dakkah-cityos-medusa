import { model } from "@medusajs/framework/utils"

const LeaseAgreement = model.define("lease_agreement", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  listing_id: model.text(),
  landlord_id: model.text(),
  tenant_customer_id: model.text(),
  status: model.enum(["draft", "active", "expired", "terminated", "renewed"]).default("draft"),
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  monthly_rent: model.bigNumber(),
  currency_code: model.text(),
  deposit_amount: model.bigNumber().nullable(),
  deposit_status: model.enum(["held", "partially_returned", "returned"]).nullable(),
  payment_day: model.number().default(1),
  terms: model.json().nullable(),
  signed_at: model.dateTime().nullable(),
  terminated_at: model.dateTime().nullable(),
  termination_reason: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default LeaseAgreement
