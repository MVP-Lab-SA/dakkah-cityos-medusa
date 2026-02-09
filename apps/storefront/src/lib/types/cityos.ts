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

export interface PlatformContextTenant {
  id: string
  name: string
  slug: string
  domain: string
  residencyZone: string
  status: string
  description: string
  settings: {
    defaultLocale: string
    supportedLocales: Array<{ locale: string }>
    timezone: string
    currency: string
  }
}

export interface PlatformNodeHierarchy {
  id: string
  name: string
  code: string | null
  type: "CITY" | "DISTRICT" | "ZONE" | "FACILITY" | "ASSET"
  slug: string
  status: string
  coordinates: { lat: number; lng: number } | null
  parent: string | null
  children: PlatformNodeHierarchy[]
}

export interface PlatformGovernanceChain {
  region: { id: string; name: string; code: string; residencyZone: string } | null
  country: { id: string; name: string; code: string; settings: Record<string, unknown> } | null
  authorities: Array<{ id: string; name: string; code: string; type: string; jurisdiction: Record<string, unknown> }>
  policies: GovernancePolicy
}

export interface PlatformCapabilities {
  plugins: {
    official: string[]
    community: string[]
    custom: string[]
  }
  features: Record<string, unknown>
  endpoints: Record<string, { method: string; auth: string; purpose: string }>
}

export interface PlatformSystem {
  id: string
  name: string
  type: string
  category: string
  status: string
  capabilities: string[]
  hasBaseUrl: boolean
}

export interface PlatformContextData {
  tenant: PlatformContextTenant
  nodeHierarchy: PlatformNodeHierarchy[]
  governanceChain: PlatformGovernanceChain
  capabilities: PlatformCapabilities
  systems: {
    total: number
    active: number
    external: number
    registry: PlatformSystem[]
  }
  contextHeaders: string[]
  hierarchyLevels: string[]
  resolvedAt: string
  isDefaultTenant: boolean
}

export interface PlatformContextResponse {
  success: boolean
  data: PlatformContextData
}

export type CMSPageTemplate = 
  | "landing"
  | "static"
  | "vertical-list"
  | "vertical-detail"
  | "home"
  | "category"
  | "node-browser"
  | "custom"

export type CMSPageStatus = "draft" | "published" | "archived"

export interface CMSVerticalConfig {
  verticalSlug: string
  medusaEndpoint: string
  itemsPerPage?: number
  cardLayout?: "grid" | "list" | "map"
  filterFields?: Array<{ fieldName: string; fieldType: string; label: string }>
  sortFields?: Array<{ fieldName: string; label: string; defaultDirection?: "asc" | "desc" }>
  detailFields?: Array<{ fieldName: string; fieldType: string; label: string; section?: string }>
}

export interface CMSSeoConfig {
  title?: string
  description?: string
  ogImage?: { url: string; alt?: string }
  keywords?: string[]
  canonicalUrl?: string
  noIndex?: boolean
}

export interface CMSPage {
  id: string
  title: string
  slug: string
  path: string
  template: CMSPageTemplate
  status: CMSPageStatus
  publishedAt?: string
  parent?: string | { id: string; title: string; path: string }
  tenant: string | { id: string; name: string; slug: string }
  locale?: string
  layout?: CMSBlock[]
  verticalConfig?: CMSVerticalConfig
  nodeScope?: string | { id: string; name: string; type: string }
  governanceTags?: string[]
  seo?: CMSSeoConfig
  breadcrumbs?: Array<{ id: string; title: string; path: string }>
  sortOrder?: number
  _status?: "published" | "draft"
  countryCode?: string
  regionZone?: string
  nodeId?: string
  nodeLevel?: string
  createdAt: string
  updatedAt: string
}

export interface CMSBlock {
  id?: string
  blockType: string
  [key: string]: unknown
}

export interface CMSHeroBlock extends CMSBlock {
  blockType: "hero"
  heading: string
  subheading?: string
  backgroundImage?: { url: string; alt?: string }
  ctaText?: string
  ctaLink?: string
  alignment?: "left" | "center" | "right"
  overlay?: boolean
}

export interface CMSContentBlock extends CMSBlock {
  blockType: "content"
  richText: any
  alignment?: "left" | "center" | "right"
}

export interface CMSProductsBlock extends CMSBlock {
  blockType: "products"
  title?: string
  medusaQuery?: Record<string, unknown>
  layout?: "grid" | "carousel" | "list"
  limit?: number
  regionId?: string
}

export interface CMSFeaturesBlock extends CMSBlock {
  blockType: "features"
  title?: string
  items: Array<{ icon?: string; title: string; description: string; link?: string }>
}

export interface CMSCTABlock extends CMSBlock {
  blockType: "cta"
  heading: string
  description?: string
  buttonText: string
  buttonLink: string
  variant?: "primary" | "secondary" | "outline"
  backgroundImage?: { url: string; alt?: string }
}

export interface CMSVerticalGridBlock extends CMSBlock {
  blockType: "vertical-grid"
  title?: string
  verticalSlug: string
  medusaEndpoint: string
  limit?: number
  columns?: 2 | 3 | 4
  cardLayout?: "grid" | "list"
  filters?: Record<string, unknown>
}

export interface CMSVerticalDetailBlock extends CMSBlock {
  blockType: "vertical-detail"
  verticalSlug: string
  medusaEndpoint: string
  sections?: Array<{ title: string; fields: Array<{ fieldName: string; fieldType: string; label: string }> }>
  relatedItemsLimit?: number
}

export interface CMSImageGalleryBlock extends CMSBlock {
  blockType: "image-gallery"
  title?: string
  images: Array<{ url: string; alt?: string; caption?: string }>
  layout?: "grid" | "masonry" | "carousel"
}

export interface CMSTestimonialsBlock extends CMSBlock {
  blockType: "testimonials"
  title?: string
  items: Array<{ quote: string; author: string; role?: string; avatar?: { url: string }; rating?: number }>
}

export interface CMSStatsBlock extends CMSBlock {
  blockType: "stats"
  title?: string
  items: Array<{ value: string; label: string; icon?: string; suffix?: string }>
}

export interface CMSMapBlock extends CMSBlock {
  blockType: "map"
  title?: string
  center: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{ lat: number; lng: number; label?: string; link?: string }>
}

export interface CMSFAQBlock extends CMSBlock {
  blockType: "faq"
  title?: string
  items: Array<{ question: string; answer: string }>
}

export interface CMSPricingBlock extends CMSBlock {
  blockType: "pricing"
  title?: string
  plans: Array<{
    name: string; price: number; currency: string; interval?: string
    features: string[]; ctaText?: string; ctaLink?: string; highlighted?: boolean
  }>
}

export interface CMSNavigationItem {
  id?: string
  label: string
  type: "page" | "url" | "vertical" | "node"
  page?: string | { id: string; path: string; title: string }
  url?: string
  icon?: string
  children?: CMSNavigationItem[]
}

export interface CMSNavigation {
  id: string
  name: string
  slug: string
  tenant: string | { id: string }
  locale?: string
  items: CMSNavigationItem[]
  location: "header" | "footer" | "sidebar" | "mobile"
  status: "active" | "inactive"
}

export interface CMSVertical {
  id: string
  name: string
  slug: string
  tenant: string | { id: string }
  description?: string
  icon?: string
  coverImage?: { url: string; alt?: string }
  medusaEndpoint: string
  isEnabled: boolean
  governanceRequired?: boolean
  cardSchema?: Record<string, unknown>
  detailSchema?: Record<string, unknown>
  sortOrder?: number
  status: "active" | "inactive"
}