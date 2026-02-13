import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  DEFAULT_TENANT_SLUG,
  PLATFORM_CAPABILITIES,
  CONTEXT_HEADERS,
  HIERARCHY_LEVELS,
  buildNodeHierarchy,
  buildGovernanceChain,
  formatTenantResponse,
  getSystemsSummary,
} from "../../../lib/platform/index.js"

export const AUTHENTICATE = false

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const tenantSlug = (req.query?.tenant || req.query?.tenantId || req.headers["x-cityos-tenant-id"] || DEFAULT_TENANT_SLUG) as string
  const nodeId = (req.query?.node || req.query?.nodeId || req.headers["x-cityos-node-id"]) as string | undefined

  try {
    const tenantModule = req.scope.resolve("tenant") as any
    const nodeModule = req.scope.resolve("node") as any
    const governanceModule = req.scope.resolve("governance") as any

    let tenant = await tenantModule.resolveTenant({ slug: tenantSlug })
    let isDefaultTenant = false

    if (!tenant) {
      tenant = await tenantModule.resolveTenant({ slug: DEFAULT_TENANT_SLUG })
      isDefaultTenant = true
    }

    if (!tenant) {
      return res.status(503).json({ success: false, message: "Platform tenant unavailable" })
    }

    if (tenantSlug === DEFAULT_TENANT_SLUG) {
      isDefaultTenant = true
    }

    let nodeHierarchy: any[] = []
    try {
      const filters: any = {}
      if (nodeId) filters.parent_id = nodeId
      const flatNodes = await nodeModule.listNodesByTenant(tenant.id, filters)
      nodeHierarchy = buildNodeHierarchy(flatNodes)
    } catch {
      nodeHierarchy = []
    }

    let governanceChain: any = { region: null, country: null, authorities: [], policies: {} }
    try {
      const effectivePolicies = await governanceModule.resolveEffectivePolicies(tenant.id)
      let authorities: any[] = []
      try {
        const rawAuthorities = await governanceModule.listGovernanceAuthorities({ tenant_id: tenant.id })
        authorities = Array.isArray(rawAuthorities) ? rawAuthorities : [rawAuthorities].filter(Boolean)
      } catch {
        authorities = []
      }
      governanceChain = buildGovernanceChain(authorities, effectivePolicies)
    } catch {
    }

    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300")

    return res.json({
      success: true,
      data: {
        tenant: formatTenantResponse(tenant),
        nodeHierarchy,
        governanceChain,
        capabilities: PLATFORM_CAPABILITIES,
        systems: getSystemsSummary(),
        contextHeaders: [...CONTEXT_HEADERS],
        hierarchyLevels: [...HIERARCHY_LEVELS],
        resolvedAt: new Date().toISOString(),
        isDefaultTenant,
      },
    })
  } catch (error: any) {
    console.error("Platform context error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}
