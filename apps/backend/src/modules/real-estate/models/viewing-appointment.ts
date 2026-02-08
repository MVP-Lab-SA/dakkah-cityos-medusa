import { model } from "@medusajs/framework/utils"

const ViewingAppointment = model.define("viewing_appointment", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  listing_id: model.text(),
  agent_id: model.text().nullable(),
  client_id: model.text(),
  scheduled_at: model.dateTime(),
  duration_minutes: model.number().default(30),
  status: model.enum(["requested", "confirmed", "completed", "cancelled", "no_show"]).default("requested"),
  viewing_type: model.enum(["in_person", "virtual"]).default("in_person"),
  notes: model.text().nullable(),
  feedback: model.text().nullable(),
  interest_level: model.enum(["not_interested", "somewhat", "very_interested", "making_offer"]).nullable(),
  confirmed_at: model.dateTime().nullable(),
  cancelled_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default ViewingAppointment
