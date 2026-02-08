import { model } from "@medusajs/framework/utils"

const AuditLog = model.define("audit_log", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),

  action: model.text(),
  resource_type: model.text(),
  resource_id: model.text(),

  actor_id: model.text().nullable(),
  actor_role: model.text().nullable(),
  actor_email: model.text().nullable(),

  node_id: model.text().nullable(),

  changes: model.json().nullable(),
  previous_values: model.json().nullable(),
  new_values: model.json().nullable(),

  ip_address: model.text().nullable(),
  user_agent: model.text().nullable(),

  data_classification: model.enum(["public", "internal", "confidential", "restricted"]).default("internal"),

  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["resource_type", "resource_id"] },
  { on: ["actor_id"] },
  { on: ["action"] },
  { on: ["tenant_id", "resource_type"] },
  { on: ["data_classification"] },
])

export default AuditLog
