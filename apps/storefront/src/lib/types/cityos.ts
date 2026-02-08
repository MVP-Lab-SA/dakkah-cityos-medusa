export type NodeType = "CITY" | "DISTRICT" | "ZONE" | "FACILITY" | "ASSET"

export interface Node {
  id: string
  tenant_id: string
  parent_id?: string
  name: string
  code: string
  type: NodeType
  description?: string
  is_active: boolean
  sort_order: number
  path: string
  depth: number
  children?: Node[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface GovernanceAuthority {
  id: string
  tenant_id: string
  name: string
  jurisdiction_level: "region" | "country" | "authority" | "department"
  parent_id?: string
  policies: GovernancePolicy
  effective_policies?: GovernancePolicy
  is_active: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface GovernancePolicy {
  data_residency?: {
    storage_location?: string
    cross_border_allowed?: boolean
    encryption_required?: boolean
  }
  content_moderation?: {
    auto_approve?: boolean
    require_review?: boolean
    prohibited_categories?: string[]
  }
  commerce?: {
    max_transaction_amount?: number
    allowed_currencies?: string[]
    tax_inclusive?: boolean
    require_kyc?: boolean
  }
  privacy?: {
    data_retention_days?: number
    consent_required?: boolean
    anonymization_required?: boolean
  }
  [key: string]: unknown
}

export type PersonaAxis =
  | "demographics"
  | "psychographics"
  | "behavioral"
  | "contextual"
  | "transactional"
  | "engagement"

export type PersonaPrecedence = "tenant-default" | "user-default" | "membership" | "surface" | "session"

export interface Persona {
  id: string
  tenant_id: string
  name: string
  description?: string
  axes: Record<PersonaAxis, PersonaAxisValue>
  precedence: PersonaPrecedence
  precedence_weight: number
  is_active: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PersonaAxisValue {
  value: string | number | boolean | Record<string, unknown>
  confidence?: number
  source?: string
  updated_at?: string
}

export interface PersonaAssignment {
  id: string
  persona_id: string
  entity_type: "user" | "segment" | "surface" | "session"
  entity_id: string
  tenant_id: string
  is_active: boolean
  assigned_at: string
  expires_at?: string
  metadata?: Record<string, unknown>
}

export interface NodeContext {
  tenant_id: string
  node_id?: string
  persona_id?: string
  locale: string
  channel?: string
}

export interface NodesResponse {
  nodes: Node[]
  count: number
}

export interface GovernanceResponse {
  authorities: GovernanceAuthority[]
  effective_policies: GovernancePolicy
}

export interface PersonaResponse {
  personas: Persona[]
  resolved_persona?: Persona
}
