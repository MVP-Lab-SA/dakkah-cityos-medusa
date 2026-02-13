import { MedusaService } from "@medusajs/framework/utils"
import Persona from "./models/persona"
import { PersonaAssignment } from "./models/persona-assignment"

const SCOPE_PRIORITY: Record<string, number> = {
  "session": 500,
  "surface": 400,
  "membership": 300,
  "user-default": 200,
  "tenant-default": 100,
}

const GEO_SCOPE_ORDER = ["facility", "zone", "district", "city", "global"]
const DATA_CLASSIFICATION_ORDER = ["public", "internal", "confidential", "restricted"]

class PersonaModuleService extends MedusaService({
  Persona,
  PersonaAssignment,
}) {
  async resolvePersona(
    tenantId: string,
    userId: string,
    sessionContext?: { sessionId?: string; surface?: string; scope?: string }
  ) {
    const assignments = await this.listPersonaAssignments({
      tenant_id: tenantId,
      status: "active",
    }) as any[]

    const now = new Date()

    const filtered = (Array.isArray(assignments) ? assignments : [assignments].filter(Boolean))
      .filter((a: any) => {
        if (a.starts_at && new Date(a.starts_at) > now) return false
        if (a.ends_at && new Date(a.ends_at) < now) return false
        return true
      })
      .filter((a: any) => {
        if (a.scope === "tenant-default") return true
        if (a.scope === "user-default" && a.user_id === userId) return true
        if (a.scope === "membership" && a.user_id === userId) return true
        if (a.scope === "surface" && sessionContext?.surface && a.scope_reference === sessionContext.surface) return true
        if (a.scope === "session" && sessionContext?.sessionId && a.scope_reference === sessionContext.sessionId) return true
        return false
      })

    if (filtered.length === 0) return null

    const ranked = filtered.map((a: any) => ({
      ...a,
      effectivePriority: (SCOPE_PRIORITY[a.scope] || 0) + (a.priority || 0),
    }))

    ranked.sort((a: any, b: any) => b.effectivePriority - a.effectivePriority)

    const winner = ranked[0]
    const persona = await this.retrievePersona(winner.persona_id)

    return persona
  }

  mergePersonaConstraints(personas: any[]) {
    const defaults = {
      kidSafe: false,
      readOnly: false,
      geoScope: "global" as string,
      maxDataClassification: "restricted" as string,
    }

    if (!personas || personas.length === 0) return defaults

    let kidSafe = false
    let readOnly = false
    let narrowestGeoIndex = GEO_SCOPE_ORDER.length - 1
    let lowestClassIndex = DATA_CLASSIFICATION_ORDER.length - 1

    for (const persona of personas) {
      const constraints = persona.constraints as any
      if (!constraints) continue

      if (constraints.kid_safe || constraints.kidSafe) kidSafe = true
      if (constraints.read_only || constraints.readOnly) readOnly = true

      const geoScope = constraints.geo_scope || constraints.geoScope
      if (geoScope) {
        const geoIndex = GEO_SCOPE_ORDER.indexOf(geoScope)
        if (geoIndex !== -1 && geoIndex < narrowestGeoIndex) {
          narrowestGeoIndex = geoIndex
        }
      }

      const maxClass = constraints.max_data_classification || constraints.maxDataClassification
      if (maxClass) {
        const classIndex = DATA_CLASSIFICATION_ORDER.indexOf(maxClass)
        if (classIndex !== -1 && classIndex < lowestClassIndex) {
          lowestClassIndex = classIndex
        }
      }
    }

    return {
      kidSafe,
      readOnly,
      geoScope: GEO_SCOPE_ORDER[narrowestGeoIndex],
      maxDataClassification: DATA_CLASSIFICATION_ORDER[lowestClassIndex],
    }
  }

  async getPersonasForTenant(tenantId: string) {
    const personas = await this.listPersonas({ tenant_id: tenantId }) as any
    return Array.isArray(personas) ? personas : [personas].filter(Boolean)
  }

  async assignPersona(data: {
    tenantId: string
    personaId: string
    userId?: string
    scope: string
    scopeReference?: string
    priority?: number
  }) {
    return await (this as any).createPersonaAssignments({
      tenant_id: data.tenantId,
      persona_id: data.personaId,
      user_id: data.userId || null,
      scope: data.scope,
      scope_reference: data.scopeReference || null,
      priority: data.priority || 0,
      status: "active",
    })
  }
}

export default PersonaModuleService
