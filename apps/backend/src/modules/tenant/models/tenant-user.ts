import { model } from "@medusajs/framework/utils"

export const TenantUser = model.define("tenant_user", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  user_id: model.text(), // Medusa admin user
  
  // Role
  role: model.enum([
    "owner",
    "admin",
    "manager",
    "editor",
    "viewer",
    "support"
  ]).default("viewer"),
  
  // Permissions (fine-grained)
  permissions: model.json().nullable(),
  /*
  Example permissions:
  {
    products: ["read", "create", "update", "delete"],
    orders: ["read", "update"],
    customers: ["read"],
    settings: [],
    team: ["read", "invite"]
  }
  */
  
  // Status
  status: model.enum(["active", "inactive", "invited"]).default("invited"),
  
  // Invitation
  invitation_token: model.text().nullable(),
  invitation_sent_at: model.dateTime().nullable(),
  invitation_accepted_at: model.dateTime().nullable(),
  invited_by_id: model.text().nullable(),
  
  // Access
  last_active_at: model.dateTime().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["user_id"] },
  { on: ["tenant_id", "user_id"], unique: true },
  { on: ["status"] },
  { on: ["invitation_token"] },
])
