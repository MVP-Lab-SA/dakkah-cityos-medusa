import { describe, it, expect } from 'vitest'

const RBAC_ROLES = {
  "super-admin": { level: 100, isAdmin: true, canWrite: true, canAudit: true },
  "tenant-admin": { level: 90, isAdmin: true, canWrite: true, canAudit: true },
  "compliance-officer": { level: 85, isAdmin: false, canWrite: false, canAudit: true },
  "auditor": { level: 80, isAdmin: false, canWrite: false, canAudit: true },
  "city-manager": { level: 70, isAdmin: false, canWrite: true, canAudit: false },
  "district-manager": { level: 60, isAdmin: false, canWrite: true, canAudit: false },
  "zone-operator": { level: 50, isAdmin: false, canWrite: true, canAudit: false },
  "facility-operator": { level: 40, isAdmin: false, canWrite: false, canAudit: false },
  "asset-technician": { level: 30, isAdmin: false, canWrite: false, canAudit: false },
  "viewer": { level: 10, isAdmin: false, canWrite: false, canAudit: false },
} as const

type RBACRole = keyof typeof RBAC_ROLES

function hasHigherRole(role1: RBACRole, role2: RBACRole): boolean {
  return RBAC_ROLES[role1].level > RBAC_ROLES[role2].level
}

function hasMinimumRole(userRole: RBACRole, requiredRole: RBACRole): boolean {
  return RBAC_ROLES[userRole].level >= RBAC_ROLES[requiredRole].level
}

function isAdminRole(role: RBACRole): boolean {
  return RBAC_ROLES[role].isAdmin
}

function getWriteRoles(): RBACRole[] {
  return (Object.entries(RBAC_ROLES) as [RBACRole, any][])
    .filter(([_, config]) => config.canWrite)
    .map(([role]) => role)
}

function getAuditRoles(): RBACRole[] {
  return (Object.entries(RBAC_ROLES) as [RBACRole, any][])
    .filter(([_, config]) => config.canAudit)
    .map(([role]) => role)
}

const NODE_ROLE_MAP: Record<string, RBACRole> = {
  CITY: "city-manager",
  DISTRICT: "district-manager",
  ZONE: "zone-operator",
  FACILITY: "facility-operator",
  ASSET: "asset-technician",
}

const NODE_TYPES = ["CITY", "DISTRICT", "ZONE", "FACILITY", "ASSET"] as const
type NodeType = typeof NODE_TYPES[number]

const NODE_HIERARCHY_RULES: Record<NodeType, {
  depth: number; allowedParents: NodeType[]; allowedChildren: NodeType[]; isRoot: boolean; isLeaf: boolean
}> = {
  CITY: { depth: 0, allowedParents: [], allowedChildren: ["DISTRICT"], isRoot: true, isLeaf: false },
  DISTRICT: { depth: 1, allowedParents: ["CITY"], allowedChildren: ["ZONE"], isRoot: false, isLeaf: false },
  ZONE: { depth: 2, allowedParents: ["DISTRICT"], allowedChildren: ["FACILITY"], isRoot: false, isLeaf: false },
  FACILITY: { depth: 3, allowedParents: ["ZONE"], allowedChildren: ["ASSET"], isRoot: false, isLeaf: false },
  ASSET: { depth: 4, allowedParents: ["FACILITY"], allowedChildren: [], isRoot: false, isLeaf: true },
}

function isValidParentType(parentType: NodeType, childType: NodeType): boolean {
  return NODE_HIERARCHY_RULES[childType].allowedParents.includes(parentType)
}

function getValidParentTypes(nodeType: NodeType): NodeType[] {
  return NODE_HIERARCHY_RULES[nodeType].allowedParents
}

function canBeRoot(nodeType: NodeType): boolean {
  return NODE_HIERARCHY_RULES[nodeType].isRoot
}

function getNodeTypeDepth(nodeType: NodeType): number {
  return NODE_HIERARCHY_RULES[nodeType].depth
}

function getAncestorTypes(nodeType: NodeType): NodeType[] {
  const depth = getNodeTypeDepth(nodeType)
  return NODE_TYPES.filter(t => NODE_HIERARCHY_RULES[t].depth < depth)
}

function getDescendantTypes(nodeType: NodeType): NodeType[] {
  const depth = getNodeTypeDepth(nodeType)
  return NODE_TYPES.filter(t => NODE_HIERARCHY_RULES[t].depth > depth)
}

const RESIDENCY_ZONES = {
  GCC: { crossBorderAllowed: false, localStorageRequired: true, storageLocations: ["sa-east-1", "ae-east-1"], minimumClassification: "confidential" },
  EU: { crossBorderAllowed: false, localStorageRequired: true, storageLocations: ["eu-west-1", "eu-central-1"], minimumClassification: "confidential" },
  MENA: { crossBorderAllowed: true, localStorageRequired: true, storageLocations: ["me-south-1"], minimumClassification: "internal" },
  APAC: { crossBorderAllowed: true, localStorageRequired: false, storageLocations: ["ap-southeast-1", "ap-northeast-1"], minimumClassification: "internal" },
  AMERICAS: { crossBorderAllowed: true, localStorageRequired: false, storageLocations: ["us-east-1", "us-west-2"], minimumClassification: "internal" },
  GLOBAL: { crossBorderAllowed: true, localStorageRequired: false, storageLocations: ["us-east-1", "eu-west-1", "ap-southeast-1"], minimumClassification: "public" },
} as const

const PERSONA_AXES = {
  audience: ["resident", "visitor", "student", "family", "senior", "accessibility", "nightlife", "budget", "luxury"],
  economic: ["consumer", "freelancer", "micro-merchant", "sme-staff", "enterprise-staff"],
  ecosystem: ["ambassador", "business-owner", "business-staff", "partner", "vendor", "courier"],
  government: ["inspector", "caseworker", "permit-reviewer", "analyst", "supervisor", "auditor", "emergency-ops"],
  interaction: ["quick-task", "discovery", "planning", "work", "kiosk", "voice-first"],
  ai_mode: ["strict-factual", "creative", "concierge", "operational", "safety-first"],
} as const

const SCOPE_PRIORITY: Record<string, number> = {
  session: 500, surface: 400, membership: 300, "user-default": 200, "tenant-default": 100,
}

const GEO_SCOPE_ORDER = ["facility", "zone", "district", "city", "global"] as const
const DATA_CLASSIFICATION_ORDER = ["public", "internal", "confidential", "restricted"] as const

const CHANNEL_TYPES = ["web", "mobile", "api", "kiosk", "internal"] as const
const SUPPORTED_LOCALES = ["en", "fr", "ar"] as const
const LOCALE_CONFIG: Record<string, { language: string; direction: "ltr" | "rtl" }> = {
  en: { language: "English", direction: "ltr" },
  fr: { language: "French", direction: "ltr" },
  ar: { language: "Arabic", direction: "rtl" },
}

describe('RBAC Contracts', () => {
  describe('RBAC_ROLES', () => {
    it('has super-admin at highest level', () => {
      expect(RBAC_ROLES['super-admin'].level).toBe(100)
    })

    it('has viewer at lowest level', () => {
      expect(RBAC_ROLES['viewer'].level).toBe(10)
    })

    it('admin roles have isAdmin true', () => {
      expect(RBAC_ROLES['super-admin'].isAdmin).toBe(true)
      expect(RBAC_ROLES['tenant-admin'].isAdmin).toBe(true)
    })

    it('non-admin roles have isAdmin false', () => {
      expect(RBAC_ROLES['viewer'].isAdmin).toBe(false)
      expect(RBAC_ROLES['city-manager'].isAdmin).toBe(false)
    })
  })

  describe('hasHigherRole', () => {
    it('super-admin is higher than tenant-admin', () => {
      expect(hasHigherRole('super-admin', 'tenant-admin')).toBe(true)
    })

    it('viewer is not higher than city-manager', () => {
      expect(hasHigherRole('viewer', 'city-manager')).toBe(false)
    })

    it('same role is not higher', () => {
      expect(hasHigherRole('viewer', 'viewer')).toBe(false)
    })
  })

  describe('hasMinimumRole', () => {
    it('super-admin meets any minimum', () => {
      expect(hasMinimumRole('super-admin', 'viewer')).toBe(true)
    })

    it('viewer does not meet city-manager minimum', () => {
      expect(hasMinimumRole('viewer', 'city-manager')).toBe(false)
    })

    it('same role meets its own minimum', () => {
      expect(hasMinimumRole('city-manager', 'city-manager')).toBe(true)
    })
  })

  describe('isAdminRole', () => {
    it('returns true for admin roles', () => {
      expect(isAdminRole('super-admin')).toBe(true)
      expect(isAdminRole('tenant-admin')).toBe(true)
    })

    it('returns false for non-admin roles', () => {
      expect(isAdminRole('viewer')).toBe(false)
      expect(isAdminRole('auditor')).toBe(false)
    })
  })

  describe('getWriteRoles', () => {
    it('returns roles with canWrite', () => {
      const writeRoles = getWriteRoles()
      expect(writeRoles).toContain('super-admin')
      expect(writeRoles).toContain('city-manager')
      expect(writeRoles).not.toContain('viewer')
      expect(writeRoles).not.toContain('auditor')
    })
  })

  describe('getAuditRoles', () => {
    it('returns roles with canAudit', () => {
      const auditRoles = getAuditRoles()
      expect(auditRoles).toContain('super-admin')
      expect(auditRoles).toContain('auditor')
      expect(auditRoles).toContain('compliance-officer')
      expect(auditRoles).not.toContain('viewer')
    })
  })

  describe('NODE_ROLE_MAP', () => {
    it('maps node types to roles', () => {
      expect(NODE_ROLE_MAP['CITY']).toBe('city-manager')
      expect(NODE_ROLE_MAP['DISTRICT']).toBe('district-manager')
      expect(NODE_ROLE_MAP['ZONE']).toBe('zone-operator')
      expect(NODE_ROLE_MAP['FACILITY']).toBe('facility-operator')
      expect(NODE_ROLE_MAP['ASSET']).toBe('asset-technician')
    })
  })
})

describe('Node Type Contracts', () => {
  describe('NODE_TYPES', () => {
    it('has 5 node types in order', () => {
      expect([...NODE_TYPES]).toEqual(['CITY', 'DISTRICT', 'ZONE', 'FACILITY', 'ASSET'])
    })
  })

  describe('NODE_HIERARCHY_RULES', () => {
    it('CITY is root with no parents', () => {
      expect(NODE_HIERARCHY_RULES['CITY'].isRoot).toBe(true)
      expect(NODE_HIERARCHY_RULES['CITY'].allowedParents).toEqual([])
      expect(NODE_HIERARCHY_RULES['CITY'].depth).toBe(0)
    })

    it('ASSET is leaf with no children', () => {
      expect(NODE_HIERARCHY_RULES['ASSET'].isLeaf).toBe(true)
      expect(NODE_HIERARCHY_RULES['ASSET'].allowedChildren).toEqual([])
      expect(NODE_HIERARCHY_RULES['ASSET'].depth).toBe(4)
    })

    it('intermediate nodes have correct parent-child relationships', () => {
      expect(NODE_HIERARCHY_RULES['DISTRICT'].allowedParents).toEqual(['CITY'])
      expect(NODE_HIERARCHY_RULES['DISTRICT'].allowedChildren).toEqual(['ZONE'])
    })
  })

  describe('isValidParentType', () => {
    it('CITY is valid parent for DISTRICT', () => {
      expect(isValidParentType('CITY', 'DISTRICT')).toBe(true)
    })

    it('CITY is not valid parent for ZONE', () => {
      expect(isValidParentType('CITY', 'ZONE')).toBe(false)
    })

    it('ASSET cannot be parent of anything', () => {
      expect(isValidParentType('ASSET', 'CITY')).toBe(false)
    })
  })

  describe('getValidParentTypes', () => {
    it('CITY has no valid parents', () => {
      expect(getValidParentTypes('CITY')).toEqual([])
    })

    it('DISTRICT has CITY as valid parent', () => {
      expect(getValidParentTypes('DISTRICT')).toEqual(['CITY'])
    })
  })

  describe('canBeRoot', () => {
    it('only CITY can be root', () => {
      expect(canBeRoot('CITY')).toBe(true)
      expect(canBeRoot('DISTRICT')).toBe(false)
      expect(canBeRoot('ASSET')).toBe(false)
    })
  })

  describe('getNodeTypeDepth', () => {
    it('returns correct depth for each type', () => {
      expect(getNodeTypeDepth('CITY')).toBe(0)
      expect(getNodeTypeDepth('DISTRICT')).toBe(1)
      expect(getNodeTypeDepth('ZONE')).toBe(2)
      expect(getNodeTypeDepth('FACILITY')).toBe(3)
      expect(getNodeTypeDepth('ASSET')).toBe(4)
    })
  })

  describe('getAncestorTypes', () => {
    it('CITY has no ancestors', () => {
      expect(getAncestorTypes('CITY')).toEqual([])
    })

    it('ASSET has all other types as ancestors', () => {
      expect(getAncestorTypes('ASSET')).toEqual(['CITY', 'DISTRICT', 'ZONE', 'FACILITY'])
    })

    it('ZONE has CITY and DISTRICT as ancestors', () => {
      expect(getAncestorTypes('ZONE')).toEqual(['CITY', 'DISTRICT'])
    })
  })

  describe('getDescendantTypes', () => {
    it('ASSET has no descendants', () => {
      expect(getDescendantTypes('ASSET')).toEqual([])
    })

    it('CITY has all other types as descendants', () => {
      expect(getDescendantTypes('CITY')).toEqual(['DISTRICT', 'ZONE', 'FACILITY', 'ASSET'])
    })
  })
})

describe('Governance Contracts', () => {
  describe('RESIDENCY_ZONES', () => {
    it('has all expected zones', () => {
      expect(Object.keys(RESIDENCY_ZONES)).toEqual(['GCC', 'EU', 'MENA', 'APAC', 'AMERICAS', 'GLOBAL'])
    })

    it('GCC requires local storage', () => {
      expect(RESIDENCY_ZONES.GCC.localStorageRequired).toBe(true)
      expect(RESIDENCY_ZONES.GCC.crossBorderAllowed).toBe(false)
    })

    it('GLOBAL allows cross-border', () => {
      expect(RESIDENCY_ZONES.GLOBAL.crossBorderAllowed).toBe(true)
      expect(RESIDENCY_ZONES.GLOBAL.localStorageRequired).toBe(false)
    })

    it('EU has strict requirements', () => {
      expect(RESIDENCY_ZONES.EU.crossBorderAllowed).toBe(false)
      expect(RESIDENCY_ZONES.EU.localStorageRequired).toBe(true)
      expect(RESIDENCY_ZONES.EU.minimumClassification).toBe('confidential')
    })

    it('each zone has storage locations', () => {
      for (const zone of Object.values(RESIDENCY_ZONES)) {
        expect(zone.storageLocations.length).toBeGreaterThan(0)
      }
    })
  })
})

describe('Persona Contracts', () => {
  describe('PERSONA_AXES', () => {
    it('has all axis categories', () => {
      expect(Object.keys(PERSONA_AXES)).toEqual([
        'audience', 'economic', 'ecosystem', 'government', 'interaction', 'ai_mode'
      ])
    })

    it('audience axis has expected values', () => {
      expect(PERSONA_AXES.audience).toContain('resident')
      expect(PERSONA_AXES.audience).toContain('visitor')
    })

    it('ai_mode axis has expected values', () => {
      expect(PERSONA_AXES.ai_mode).toContain('strict-factual')
      expect(PERSONA_AXES.ai_mode).toContain('creative')
    })
  })

  describe('SCOPE_PRIORITY', () => {
    it('session has highest priority', () => {
      expect(SCOPE_PRIORITY.session).toBe(500)
    })

    it('tenant-default has lowest priority', () => {
      expect(SCOPE_PRIORITY['tenant-default']).toBe(100)
    })

    it('priorities are in descending order', () => {
      expect(SCOPE_PRIORITY.session).toBeGreaterThan(SCOPE_PRIORITY.surface)
      expect(SCOPE_PRIORITY.surface).toBeGreaterThan(SCOPE_PRIORITY.membership)
      expect(SCOPE_PRIORITY.membership).toBeGreaterThan(SCOPE_PRIORITY['user-default'])
      expect(SCOPE_PRIORITY['user-default']).toBeGreaterThan(SCOPE_PRIORITY['tenant-default'])
    })
  })

  describe('GEO_SCOPE_ORDER', () => {
    it('goes from facility to global', () => {
      expect([...GEO_SCOPE_ORDER]).toEqual(['facility', 'zone', 'district', 'city', 'global'])
    })
  })

  describe('DATA_CLASSIFICATION_ORDER', () => {
    it('goes from public to restricted', () => {
      expect([...DATA_CLASSIFICATION_ORDER]).toEqual(['public', 'internal', 'confidential', 'restricted'])
    })
  })
})

describe('Channel Contracts', () => {
  describe('CHANNEL_TYPES', () => {
    it('has all channel types', () => {
      expect([...CHANNEL_TYPES]).toEqual(['web', 'mobile', 'api', 'kiosk', 'internal'])
    })
  })

  describe('SUPPORTED_LOCALES', () => {
    it('has en, fr, ar', () => {
      expect([...SUPPORTED_LOCALES]).toEqual(['en', 'fr', 'ar'])
    })
  })

  describe('LOCALE_CONFIG', () => {
    it('Arabic is RTL', () => {
      expect(LOCALE_CONFIG.ar.direction).toBe('rtl')
    })

    it('English is LTR', () => {
      expect(LOCALE_CONFIG.en.direction).toBe('ltr')
    })

    it('French is LTR', () => {
      expect(LOCALE_CONFIG.fr.direction).toBe('ltr')
    })
  })
})
