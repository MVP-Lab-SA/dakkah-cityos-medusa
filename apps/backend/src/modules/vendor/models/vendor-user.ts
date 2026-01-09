import { model } from "@medusajs/framework/utils"

const VendorUser = model.define("vendor_user", {
  id: model.id().primaryKey(),
  
  // Relationships
  vendor_id: model.text(),
  user_id: model.text(), // Reference to User module
  
  // Role
  role: model.enum([
    "owner",
    "admin",
    "manager",
    "staff",
    "viewer"
  ]).default("staff"),
  
  // Permissions
  permissions: model.json(), // Array of permission strings
  
  // Status
  status: model.enum([
    "active",
    "inactive",
    "invited"
  ]).default("invited"),
  
  // Invitation
  invitation_token: model.text().nullable(),
  invitation_sent_at: model.dateTime().nullable(),
  invitation_accepted_at: model.dateTime().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
})

export default VendorUser
