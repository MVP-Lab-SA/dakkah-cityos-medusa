import { model } from "@medusajs/framework/utils"

export const TenantUser = model.define("tenant_user", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  user_id: model.text(),
  
  role: model.enum([
    "super-admin",
    "tenant-admin",
    "compliance-officer",
    "auditor",
    "city-manager",
    "district-manager",
    "zone-operator",
    "facility-operator",
    "asset-technician",
    "viewer"
  ]).default("viewer"),
  
  role_level: model.number().default(10),
  
  assigned_nodes: model.json().nullable(),
  assigned_node_ids: model.json().nullable(),
  
  permissions: model.json().nullable(),
  
  status: model.enum(["active", "inactive", "invited"]).default("invited"),
  
  invitation_token: model.text().nullable(),
  invitation_sent_at: model.dateTime().nullable(),
  invitation_accepted_at: model.dateTime().nullable(),
  invited_by_id: model.text().nullable(),
  
  last_active_at: model.dateTime().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["user_id"] },
  { on: ["tenant_id", "user_id"], unique: true },
  { on: ["status"] },
  { on: ["invitation_token"] },
  { on: ["role_level"] },
])
