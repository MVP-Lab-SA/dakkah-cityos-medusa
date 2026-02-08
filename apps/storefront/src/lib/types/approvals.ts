export interface ApprovalWorkflow {
  id: string
  tenant_id: string
  company_id: string
  name: string
  description?: string
  trigger_type: "purchase_order" | "quote" | "expense" | "vendor_onboarding"
  conditions: ApprovalCondition[]
  steps: ApprovalStep[]
  is_active: boolean
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
  approver_role: "admin" | "buyer" | "viewer"
  approver_id?: string
  auto_approve_below?: number
  timeout_hours?: number
}

export interface ApprovalRequest {
  id: string
  workflow_id: string
  workflow?: ApprovalWorkflow
  tenant_id: string
  company_id: string
  entity_type: "purchase_order" | "quote" | "expense"
  entity_id: string
  status: ApprovalRequestStatus
  current_step: number
  requested_by: string
  requested_by_name?: string
  actions: ApprovalAction[]
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
  request_id: string
  step: number
  actor_id: string
  actor_name?: string
  action: "approve" | "reject" | "request_changes" | "escalate"
  comment?: string
  acted_at: string
}

export interface TaxExemption {
  id: string
  tenant_id: string
  company_id: string
  certificate_number: string
  issuing_authority: string
  exemption_type: "full" | "partial" | "category_specific"
  exempt_categories?: string[]
  exempt_percentage?: number
  valid_from: string
  valid_until: string
  status: "active" | "expired" | "revoked" | "pending_review"
  document_url?: string
  notes?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PaymentTerms {
  id: string
  tenant_id: string
  company_id: string
  terms_type: "net_15" | "net_30" | "net_45" | "net_60" | "prepaid" | "cod" | "custom"
  days_until_due: number
  early_payment_discount_percentage?: number
  early_payment_discount_days?: number
  late_fee_percentage?: number
  credit_limit?: number
  is_active: boolean
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
