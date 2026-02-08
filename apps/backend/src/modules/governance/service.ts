import { MedusaService } from "@medusajs/framework/utils"
import GovernanceAuthority from "./models/governance-authority"

function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const result = { ...target }

  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}

class GovernanceModuleService extends MedusaService({
  GovernanceAuthority,
}) {
  async buildAuthorityChain(authorityId: string) {
    const chain: any[] = []
    let currentId: string | null = authorityId

    while (currentId) {
      const authority = await this.retrieveGovernanceAuthority(currentId) as any
      if (!authority) break

      chain.unshift(authority)
      currentId = authority.parent_authority_id || null
    }

    return chain
  }

  async resolveEffectivePolicies(tenantId: string) {
    let mergedPolicies: Record<string, any> = {}

    const authorities = await this.listGovernanceAuthoritys({ tenant_id: tenantId }) as any
    const authorityList = Array.isArray(authorities) ? authorities : [authorities].filter(Boolean)

    const regionAuthority = authorityList.find((a: any) => a.type === "region")
    if (regionAuthority && regionAuthority.policies) {
      mergedPolicies = deepMerge(mergedPolicies, regionAuthority.policies)
    }

    const countryAuthority = authorityList.find((a: any) => a.type === "country")
    if (countryAuthority && countryAuthority.policies) {
      mergedPolicies = deepMerge(mergedPolicies, countryAuthority.policies)
    }

    const authorityEntries = authorityList
      .filter((a: any) => a.type === "authority")
      .sort((a: any, b: any) => (a.jurisdiction_level || 0) - (b.jurisdiction_level || 0))

    for (const authority of authorityEntries) {
      if (authority.policies) {
        mergedPolicies = deepMerge(mergedPolicies, authority.policies)
      }
    }

    return mergedPolicies
  }

  async getCommercePolicy(tenantId: string) {
    const effectivePolicies = await this.resolveEffectivePolicies(tenantId)
    return effectivePolicies.commerce || {}
  }
}

export default GovernanceModuleService
