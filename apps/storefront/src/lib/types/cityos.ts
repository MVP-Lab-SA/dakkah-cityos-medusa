export type NodeType = "CITY" | "DISTRICT" | "ZONE" | "FACILITY" | "ASSET"

export interface Node {
  id: string
  tenant_id: string
  parent_id?: string
  name: string
  slug: string
  code?: string
  type: NodeType
  depth: number
  breadcrumbs?: Array<{ id: string; name: string; slug: string }>
  location?: {
    lat?: number
    lng?: number
    address?: string
    city?: string
    country?: string
  }
  status: "active" | "inactive" | "archived"
  is_active?: boolean
  description?: string
  sort_order?: number
  path?: string
  children?: Node[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface GovernanceAuthority {
  id: string
  tenant_id?: string
  name: string
  slug: string
  code?: string
  type: "region" | "country" | "authority" | "department"
  jurisdiction_level: number
  parent_authority_id?: string
  parent_id?: string
  country_id?: string
  region_id?: string
  residency_zone?: "GCC" | "EU" | "MENA" | "APAC" | "AMERICAS" | "GLOBAL"
  policies?: GovernancePolicy
  effective_policies?: GovernancePolicy
  status: "active" | "inactive" | "archived"
  is_active?: boolean
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

export type PersonaCategory =
  | "demographics"
  | "psychographics"
  | "behavioral"
  | "contextual"
  | "transactional"
  | "engagement"

export type PersonaAxis = PersonaCategory

export type PersonaPrecedence = "tenant-default" | "user-default" | "membership" | "surface" | "session"

export interface Persona {
  id: string
  tenant_id: string
  name: string
  slug: string
  category: PersonaCategory
  description?: string
  axes?: Record<PersonaAxis, PersonaAxisValue>
  constraints?: Record<string, unknown>
  allowed_workflows?: string[]
  allowed_tools?: string[]
  allowed_surfaces?: string[]
  feature_overrides?: Record<string, unknown>
  priority: number
  precedence?: PersonaPrecedence
  precedence_weight?: number
  status: "active" | "inactive" | "archived"
  is_active?: boolean
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
  tenant_id: string
  persona_id: string
  user_id?: string
  scope: "tenant-default" | "user-default" | "membership" | "surface" | "session"
  scope_reference?: string
  entity_type?: "user" | "segment" | "surface" | "session"
  entity_id?: string
  priority: number
  status: "active" | "inactive" | "expired"
  starts_at?: string
  ends_at?: string
  assigned_at?: string
  expires_at?: string
  is_active?: boolean
  metadata?: Record<string, unknown>
  created_at: string
}

export interface Tenant {
  id: string
  name: string
  slug: string
  handle: string
  domain?: string
  custom_domains?: string[]
  residency_zone: "GCC" | "EU" | "MENA" | "APAC" | "AMERICAS" | "GLOBAL"
  country_id?: string
  governance_authority_id?: string
  default_locale: string
  supported_locales: string[]
  timezone: string
  default_currency: string
  date_format: string
  default_persona_id?: string
  logo_url?: string
  favicon_url?: string
  primary_color?: string
  accent_color?: string
  font_family?: string
  branding?: Record<string, unknown>
  status: "trial" | "active" | "suspended" | "deactivated"
  subscription_tier: "basic" | "professional" | "enterprise"
  billing_email?: string
  billing_address?: Record<string, unknown>
  trial_starts_at?: string
  trial_ends_at?: string
  settings?: Record<string, unknown>
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CityosStore {
  id: string
  tenant_id: string
  handle: string
  name: string
  sales_channel_id: string
  default_region_id?: string
  supported_currency_codes?: string[]
  storefront_url?: string
  subdomain?: string
  custom_domain?: string
  theme_config?: Record<string, unknown>
  logo_url?: string
  favicon_url?: string
  brand_colors?: Record<string, unknown>
  store_type: "marketplace" | "single_vendor" | "b2b" | "b2c" | "hybrid"
  status: "active" | "inactive" | "maintenance"
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  cms_site_id?: string
  settings?: Record<string, unknown>
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
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

export interface TenantResponse {
  tenant: Tenant
}
