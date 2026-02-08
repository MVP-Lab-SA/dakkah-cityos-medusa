export const PERSONA_AXES = {
  audience: ["resident", "visitor", "student", "family", "senior", "accessibility", "nightlife", "budget", "luxury"],
  economic: ["consumer", "freelancer", "micro-merchant", "sme-staff", "enterprise-staff"],
  ecosystem: ["ambassador", "business-owner", "business-staff", "partner", "vendor", "courier"],
  government: ["inspector", "caseworker", "permit-reviewer", "analyst", "supervisor", "auditor", "emergency-ops"],
  interaction: ["quick-task", "discovery", "planning", "work", "kiosk", "voice-first"],
  ai_mode: ["strict-factual", "creative", "concierge", "operational", "safety-first"],
} as const

export type PersonaAxis = keyof typeof PERSONA_AXES
export type PersonaCategory = "consumer" | "creator" | "business" | "cityops" | "platform"
export type PersonaScope = "session" | "surface" | "membership" | "user-default" | "tenant-default"
export type GeoScope = "facility" | "zone" | "district" | "city" | "global"

export const SCOPE_PRIORITY: Record<PersonaScope, number> = {
  session: 500,
  surface: 400,
  membership: 300,
  "user-default": 200,
  "tenant-default": 100,
}

export const GEO_SCOPE_ORDER: GeoScope[] = ["facility", "zone", "district", "city", "global"]
export const DATA_CLASSIFICATION_ORDER = ["public", "internal", "confidential", "restricted"] as const

export interface PersonaConstraints {
  kidSafe: boolean
  readOnly: boolean
  geoScope: GeoScope
  maxDataClassification: "public" | "internal" | "confidential" | "restricted"
}

export interface PersonaAxes {
  audience: string[]
  economic: string[]
  ecosystem: string[]
  government: string[]
  interaction: string[]
  ai_mode: string[]
}
