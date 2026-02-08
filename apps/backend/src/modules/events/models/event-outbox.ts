import { model } from "@medusajs/framework/utils"

const EventOutbox = model.define("event_outbox", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),

  event_type: model.text(),
  aggregate_type: model.text(),
  aggregate_id: model.text(),

  payload: model.json(),
  metadata: model.json().nullable(),

  source: model.text().default("commerce"),
  correlation_id: model.text().nullable(),
  causation_id: model.text().nullable(),

  actor_id: model.text().nullable(),
  actor_role: model.text().nullable(),

  node_id: model.text().nullable(),
  channel: model.text().nullable(),

  status: model.enum(["pending", "published", "failed", "archived"]).default("pending"),
  published_at: model.dateTime().nullable(),
  error: model.text().nullable(),
  retry_count: model.number().default(0),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["status"] },
  { on: ["event_type"] },
  { on: ["aggregate_type", "aggregate_id"] },
  { on: ["correlation_id"] },
  { on: ["tenant_id", "status"] },
])

export default EventOutbox
