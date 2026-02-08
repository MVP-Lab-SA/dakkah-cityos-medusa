import { model } from "@medusajs/framework/utils"

const Proposal = model.define("proposal", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  gig_id: model.text().nullable(),
  client_id: model.text(),
  freelancer_id: model.text(),
  title: model.text(),
  description: model.text(),
  proposed_price: model.bigNumber(),
  currency_code: model.text(),
  estimated_duration_days: model.number(),
  milestones: model.json().nullable(),
  status: model.enum(["submitted", "shortlisted", "accepted", "rejected", "withdrawn"]).default("submitted"),
  cover_letter: model.text().nullable(),
  attachments: model.json().nullable(),
  submitted_at: model.dateTime(),
  responded_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default Proposal
