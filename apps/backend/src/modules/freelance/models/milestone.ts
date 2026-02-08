import { model } from "@medusajs/framework/utils"

const Milestone = model.define("milestone", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  contract_id: model.text(),
  title: model.text(),
  description: model.text().nullable(),
  amount: model.bigNumber(),
  currency_code: model.text(),
  due_date: model.dateTime().nullable(),
  status: model.enum(["pending", "in_progress", "submitted", "revision_requested", "approved", "paid"]).default("pending"),
  deliverables: model.json().nullable(),
  submitted_at: model.dateTime().nullable(),
  approved_at: model.dateTime().nullable(),
  paid_at: model.dateTime().nullable(),
  revision_notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Milestone
