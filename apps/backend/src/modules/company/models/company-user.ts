import { model } from "@medusajs/framework/utils";

/**
 * Company User Membership
 * 
 * Links customers to companies with roles and permissions.
 * Supports hierarchical approval workflows.
 */
const CompanyUser = model.define("company_user", {
  id: model.id().primaryKey(),
  
  // Relationships
  company_id: model.text(),
  customer_id: model.text(),
  
  // Role & Permissions
  role: model.enum([
    "admin",      // Full company management
    "approver",   // Can approve orders/quotes
    "buyer",      // Can place orders
    "viewer"      // Read-only access
  ]).default("buyer"),
  
  // Spending Limits (per user)
  spending_limit: model.bigNumber().nullable(), // null = no limit
  spending_limit_period: model.enum(["daily", "weekly", "monthly", "yearly"]).nullable(),
  current_period_spend: model.bigNumber().default("0"),
  period_start: model.dateTime().nullable(),
  
  // Approval Authority
  approval_limit: model.bigNumber().nullable(), // can approve up to this amount
  
  // Status
  status: model.enum(["active", "inactive"]).default("active"),
  invited_at: model.dateTime().nullable(),
  joined_at: model.dateTime().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
  
  // Timestamps
  created_at: model.dateTime().defaultNow(),
  updated_at: model.dateTime().defaultNow(),
});

export default CompanyUser;
