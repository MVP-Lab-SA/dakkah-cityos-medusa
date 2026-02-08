export const RBAC_ROLES = {
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

export type RBACRole = keyof typeof RBAC_ROLES

export const NODE_ROLE_MAP: Record<string, RBACRole> = {
  CITY: "city-manager",
  DISTRICT: "district-manager",
  ZONE: "zone-operator",
  FACILITY: "facility-operator",
  ASSET: "asset-technician",
}

export function hasHigherRole(role1: RBACRole, role2: RBACRole): boolean {
  return RBAC_ROLES[role1].level > RBAC_ROLES[role2].level
}

export function hasMinimumRole(userRole: RBACRole, requiredRole: RBACRole): boolean {
  return RBAC_ROLES[userRole].level >= RBAC_ROLES[requiredRole].level
}

export function isAdminRole(role: RBACRole): boolean {
  return RBAC_ROLES[role].isAdmin
}

export function getWriteRoles(): RBACRole[] {
  return (Object.entries(RBAC_ROLES) as [RBACRole, any][])
    .filter(([_, config]) => config.canWrite)
    .map(([role]) => role)
}

export function getAuditRoles(): RBACRole[] {
  return (Object.entries(RBAC_ROLES) as [RBACRole, any][])
    .filter(([_, config]) => config.canAudit)
    .map(([role]) => role)
}
