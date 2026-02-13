import { MedusaService } from "@medusajs/framework/utils"
import RegionZoneMapping from "./models/region-zone-mapping.js"

class RegionZoneModuleService extends MedusaService({
  RegionZoneMapping,
}) {
  async getRegionsForZone(residencyZone: string) {
    const mappings = await this.listRegionZoneMappings({
      residency_zone: residencyZone,
    }) as any
    return Array.isArray(mappings) ? mappings : [mappings].filter(Boolean)
  }

  async getZoneForRegion(medusaRegionId: string) {
    const mappings = await this.listRegionZoneMappings({
      medusa_region_id: medusaRegionId,
    }) as any
    const list = Array.isArray(mappings) ? mappings : [mappings].filter(Boolean)
    return list[0] || null
  }

  async createMapping(data: {
    residency_zone: string
    medusa_region_id: string
    country_codes?: string[]
    policies_override?: Record<string, any>
    metadata?: Record<string, any>
  }) {
    return await (this as any).createRegionZoneMappings({
      residency_zone: data.residency_zone,
      medusa_region_id: data.medusa_region_id,
      country_codes: data.country_codes || null,
      policies_override: data.policies_override || null,
      metadata: data.metadata || null,
    })
  }
}

export default RegionZoneModuleService
