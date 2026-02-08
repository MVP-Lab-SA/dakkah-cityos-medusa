export interface ApprovalWorkflow {
  id: string
  company_id: string
  tenant_id?: string
  name: string
  description?: string
  workflow_type: "purchase_order" | "quote" | "expense" | "vendor_onboarding"
  trigger_type?: string
  is_active: boolean
  priority: number
  conditions?: ApprovalCondition[] | Record<string, unknown>
  steps: ApprovalStep[] | Record<string, unknown>
  notify_on_submit: boolean
  notify_on_approval: boolean
  notify_on_rejection: boolean
  notification_emails?: string[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ApprovalCondition {
  field: string
  operator: "gt" | "gte" | "lt" | "lte" | "eq" | "ne" | "in"
  value: string | number | string[]
}

export interface ApprovalStep {
  order: number
  step_number?: number
  step_name?: string
  approver_role: "admin" | "buyer" | "viewer"
  approver_id?: string
  auto_approve_below?: number
  timeout_hours?: number
}

export interface ApprovalRequest {
  id: string
  workflow_id: string
  workflow?: ApprovalWorkflow
  company_id: string
  tenant_id?: string
  entity_type: "purchase_order" | "quote" | "expense"
  entity_id: string
  requested_by_id: string
  requested_by?: string
  requested_by_name?: string
  requested_at: string
  status: ApprovalRequestStatus
  current_step: number
  request_data?: Record<string, unknown>
  currency_code?: string
  resolved_at?: string
  resolution_notes?: string
  actions?: ApprovalAction[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type ApprovalRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired"

export interface ApprovalAction {
  id: string
  approval_request_id: string
  request_id?: string
  step_number: number
  step_name?: string
  action: "approve" | "reject" | "request_changes" | "escalate"
  action_by_id: string
  actor_id?: string
  actor_name?: string
  action_at: string
  comment?: string
  acted_at?: string
}

export interface TaxExemption {
  id: string
  company_id: string
  tenant_id?: string
  certificate_number: string
  certificate_type: "resale" | "government" | "nonprofit" | "agriculture" | "manufacturing" | "other"
  exemption_type?: "full" | "partial" | "category_specific"
  issuing_state?: string
  issuing_country?: string
  issuing_authority?: string
  issue_date: string
  expiration_date?: string
  is_permanent: boolean
  status: "active" | "expired" | "revoked" | "pending_review" | "verified" | "rejected"
  verified_by_id?: string
  verified_at?: string
  verification_notes?: string
  rejection_reason?: string
  applicable_categories?: string[]
  applicable_regions?: string[]
  exempt_categories?: string[]
  exempt_percentage?: number
  certificate_file_url?: string
  supporting_documents?: string[]
  document_url?: string
  last_used_at?: string
  usage_count: number
  valid_from?: string
  valid_until?: string
  notes?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PaymentTerms {
  id: string
  tenant_id?: string
  company_id?: string
  name: string
  code: string
  description?: string
  terms_type: "net_15" | "net_30" | "net_45" | "net_60" | "prepaid" | "cod" | "custom" | "due_on_receipt" | "end_of_month"
  net_days: number
  days_until_due?: number
  early_payment_discount_percentage?: number
  early_payment_discount_days?: number
  late_fee_enabled: boolean
  late_fee_type?: "percentage" | "fixed"
  late_fee_percentage?: number
  late_fee_grace_days: number
  is_default: boolean
  is_active: boolean
  company_tiers?: string[]
  requires_credit_check: boolean
  min_credit_score?: number
  credit_limit?: number
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ApprovalFilters {
  status?: ApprovalRequestStatus[]
  entity_type?: string
  created_after?: string
  created_before?: string
}

export interface ApprovalsResponse {
  requests: ApprovalRequest[]
  count: number
}
