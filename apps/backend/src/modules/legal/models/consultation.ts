import { model } from "@medusajs/framework/utils"

const LegalConsultation = model.define("legal_consultation", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  attorney_id: model.text(),
  client_id: model.text(),
  case_id: model.text().nullable(),
  consultation_type: model.enum([
    "initial",
    "follow_up",
    "strategy",
    "settlement",
    "mediation",
  ]),
  status: model.enum([
    "scheduled",
    "in_progress",
    "completed",
    "cancelled",
    "no_show",
  ]).default("scheduled"),
  scheduled_at: model.dateTime(),
  duration_minutes: model.number().default(60),
  is_virtual: model.boolean().default(false),
  virtual_link: model.text().nullable(),
  fee: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  notes: model.text().nullable(),
  action_items: model.json().nullable(),
  completed_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default LegalConsultation
