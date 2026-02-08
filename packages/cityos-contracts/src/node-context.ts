export type NodeType = "CITY" | "DISTRICT" | "ZONE" | "FACILITY" | "ASSET"
export type ResidencyZone = "GCC" | "EU" | "MENA" | "APAC" | "AMERICAS" | "GLOBAL"
export type Channel = "web" | "mobile" | "api" | "kiosk" | "internal"
export type Locale = "en" | "fr" | "ar"
export type DataClassification = "public" | "internal" | "confidential" | "restricted"

export interface NodeContext {
  tenantId: string
  tenantSlug: string
  locale: Locale
  channel: Channel
  nodeId?: string
  nodeType?: NodeType
  sessionId?: string
  userId?: string
  personaId?: string
  residencyZone?: ResidencyZone
}
