import { model } from "@medusajs/framework/utils"

export const PersonaAssignment = model.define("persona_assignment", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),

  persona_id: model.text(),
  user_id: model.text().nullable(),

  scope: model.enum(["session", "surface", "membership", "user-default", "tenant-default"]),
  scope_reference: model.text().nullable(),

  priority: model.number().default(0),
  status: model.enum(["active", "inactive"]).default("active"),

  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime().nullable(),

  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["user_id"] },
  { on: ["persona_id"] },
  { on: ["scope"] },
  { on: ["tenant_id", "user_id", "scope"] },
])
