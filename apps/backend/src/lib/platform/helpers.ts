import { PLATFORM_SYSTEMS_REGISTRY } from "./registry.js"

export function buildNodeHierarchy(flatNodes: any[]): any[] {
  const map = new Map<string, any>()
  const roots: any[] = []

  for (const node of flatNodes) {
    map.set(node.id, {
      id: node.id,
      name: node.name,
      code: node.code || null,
      type: node.type,
      slug: node.slug,
      status: node.status || "active",
      coordinates: node.location || null,
      parent: node.parent_id || null,
      children: [],
    })
  }

  for (const node of flatNodes) {
    const current = map.get(node.id)!
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(current)
    } else {
      roots.push(current)
    }
  }

  return roots
}

export function buildGovernanceChain(authorities: any[], effectivePolicies: any): any {
  const regionAuth = authorities.find((a: any) => a.type === "region")
  const countryAuth = authorities.find((a: any) => a.type === "country")
  const otherAuths = authorities.filter((a: any) => a.type === "authority")

  return {
    region: regionAuth ? {
      id: regionAuth.id,
      name: regionAuth.name,
      code: regionAuth.code || regionAuth.slug,
      residencyZone: regionAuth.residency_zone || "GLOBAL",
    } : null,
    country: countryAuth ? {
      id: countryAuth.id,
      name: countryAuth.name,
      code: countryAuth.code || countryAuth.slug,
      settings: countryAuth.metadata || {},
    } : null,
    authorities: otherAuths.map((a: any) => ({
      id: a.id,
      name: a.name,
      code: a.code || a.slug,
      type: a.type,
      jurisdiction: a.metadata?.jurisdiction || {},
    })),
    policies: effectivePolicies || {},
  }
}

export function formatTenantResponse(tenant: any): any {
  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    domain: tenant.domain || `${tenant.slug}.cityos.dev`,
    residencyZone: tenant.residency_zone || "GLOBAL",
    status: tenant.status || "active",
    description: tenant.metadata?.description || `${tenant.name} tenant`,
    settings: {
      defaultLocale: tenant.default_locale || "en",
      supportedLocales: (tenant.supported_locales || ["en"]).map((l: string) => ({ locale: l })),
      timezone: tenant.timezone || "UTC",
      currency: tenant.default_currency || "USD",
    },
  }
}

export function getSystemsSummary() {
  const active = PLATFORM_SYSTEMS_REGISTRY.filter(s => s.status === "active").length
  const external = PLATFORM_SYSTEMS_REGISTRY.filter(s => s.type === "external").length
  return {
    total: PLATFORM_SYSTEMS_REGISTRY.length,
    active,
    external,
    registry: PLATFORM_SYSTEMS_REGISTRY,
  }
}
