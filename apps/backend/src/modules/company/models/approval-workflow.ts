import { model } from "@medusajs/framework/utils"

export const ApprovalWorkflow = model.define("approval_workflow", {
  id: model.id().primaryKey(),
  company_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Workflow Config
  name: model.text(),
  description: model.text().nullable(),
  workflow_type: model.enum([
    "purchase_order",
    "quote_request",
    "quote_acceptance",
    "user_registration",
    "credit_increase",
    "payment_terms_change",
    "return_request",
    "custom"
  ]),
  
  // Activation
  is_active: model.boolean().default(true),
  priority: model.number().default(0), // Higher = evaluated first
  
  // Conditions (when to trigger this workflow)
  conditions: model.json().nullable(), // { amount_threshold, categories, etc. }
  
  // Steps
  steps: model.json(), // Array of approval steps
  /*
  Example steps:
  [
    {
      order: 1,
      name: "Manager Approval",
      approver_type: "role", // "role", "user", "department_head", "any_with_limit"
      approver_role: "approver",
      approver_user_ids: null,
      required_approvals: 1,
      timeout_hours: 48,
      auto_approve_if_timeout: false,
      escalation_user_id: null
    },
    {
      order: 2,
      name: "Finance Approval",
      approver_type: "department_head",
      department: "finance",
      threshold_amount: 10000,
      required_approvals: 1,
      timeout_hours: 72
    }
  ]
  */
  
  // Notifications
  notify_on_submit: model.boolean().default(true),
  notify_on_approval: model.boolean().default(true),
  notify_on_rejection: model.boolean().default(true),
  notification_emails: model.json().nullable(), // Additional email addresses
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["company_id"] },
  { on: ["tenant_id"] },
  { on: ["workflow_type"] },
  { on: ["is_active", "priority"] },
])

export const ApprovalRequest = model.define("approval_request", {
  id: model.id().primaryKey(),
  workflow_id: model.text(),
  company_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Reference to the entity being approved
  entity_type: model.text(), // "purchase_order", "quote", etc.
  entity_id: model.text(),
  
  // Requestor
  requested_by_id: model.text(),
  requested_at: model.dateTime(),
  
  // Current Status
  status: model.enum([
    "pending",
    "in_progress",
    "approved",
    "rejected",
    "cancelled",
    "expired"
  ]).default("pending"),
  
  current_step: model.number().default(1),
  
  // Context
  request_data: model.json().nullable(), // Snapshot of entity at request time
  amount: model.bigNumber().nullable(), // For threshold-based workflows
  currency_code: model.text().nullable(),
  
  // Resolution
  resolved_at: model.dateTime().nullable(),
  resolution_notes: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["workflow_id"] },
  { on: ["company_id"] },
  { on: ["entity_type", "entity_id"] },
  { on: ["status"] },
  { on: ["requested_by_id"] },
])

export const ApprovalAction = model.define("approval_action", {
  id: model.id().primaryKey(),
  approval_request_id: model.text(),
  
  // Step Reference
  step_number: model.number(),
  step_name: model.text().nullable(),
  
  // Action
  action: model.enum(["approve", "reject", "request_changes", "escalate", "skip"]),
  action_by_id: model.text(),
  action_at: model.dateTime(),
  
  // Details
  comments: model.text().nullable(),
  changes_requested: model.json().nullable(),
  
  // Delegation
  delegated_from_id: model.text().nullable(), // If acting on behalf of someone
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["approval_request_id"] },
  { on: ["action_by_id"] },
  { on: ["action_at"] },
])
