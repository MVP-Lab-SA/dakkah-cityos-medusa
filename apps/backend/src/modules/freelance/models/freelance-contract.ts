import { model } from "@medusajs/framework/utils"

const FreelanceContract = model.define("freelance_contract", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  client_id: model.text(),
  freelancer_id: model.text(),
  gig_id: model.text().nullable(),
  proposal_id: model.text().nullable(),
  title: model.text(),
  description: model.text().nullable(),
  contract_type: model.enum(["fixed", "hourly", "retainer"]),
  total_amount: model.bigNumber(),
  currency_code: model.text(),
  status: model.enum(["draft", "active", "paused", "completed", "cancelled", "disputed"]).default("draft"),
  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime().nullable(),
  terms: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default FreelanceContract
