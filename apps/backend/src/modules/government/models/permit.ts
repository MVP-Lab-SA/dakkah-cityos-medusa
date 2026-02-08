import { model } from "@medusajs/framework/utils"

const Permit = model.define("permit", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  applicant_id: model.text(),
  permit_type: model.enum([
    "building",
    "business",
    "event",
    "parking",
    "renovation",
    "demolition",
    "signage",
    "food",
    "other",
  ]),
  permit_number: model.text().unique(),
  status: model.enum([
    "draft",
    "submitted",
    "under_review",
    "approved",
    "denied",
    "expired",
    "revoked",
  ]).default("draft"),
  description: model.text().nullable(),
  property_address: model.json().nullable(),
  fee: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  submitted_at: model.dateTime().nullable(),
  approved_at: model.dateTime().nullable(),
  approved_by: model.text().nullable(),
  expires_at: model.dateTime().nullable(),
  conditions: model.json().nullable(),
  denial_reason: model.text().nullable(),
  documents: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default Permit
