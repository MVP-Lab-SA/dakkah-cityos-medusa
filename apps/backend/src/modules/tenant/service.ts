import { MedusaService } from "@medusajs/framework/utils"
import Tenant from "./models/tenant"

/**
 * Tenant Module Service
 * Manages CityOS tenant operations and hierarchy
 */
class TenantModuleService extends MedusaService({
  Tenant,
}) {
  /**
   * Retrieve tenant by subdomain
   */
  async retrieveTenantBySubdomain(subdomain: string) {
    const [tenants] = await this.listTenants({
      subdomain,
      status: ["active", "trial"],
    })
    return tenants[0] || null
  }

  /**
   * Retrieve tenant by custom domain
   */
  async retrieveTenantByDomain(domain: string) {
    const [tenants] = await this.listTenants({
      custom_domain: domain,
      status: ["active", "trial"],
    })
    return tenants[0] || null
  }

  /**
   * Retrieve tenant by handle
   */
  async retrieveTenantByHandle(handle: string) {
    const [tenants] = await this.listTenants({
      handle,
    })
    return tenants[0] || null
  }

  /**
   * List tenants by CityOS hierarchy
   */
  async listTenantsByHierarchy(filters: {
    country_id?: string
    scope_type?: "theme" | "city"
    scope_id?: string
    category_id?: string
    subcategory_id?: string
  }) {
    return await this.listTenants(filters)
  }

  /**
   * Activate tenant (end trial, move to active)
   */
  async activateTenant(tenant_id: string) {
    return await this.updateTenants({
      id: tenant_id,
      status: "active",
      trial_ends_at: null,
    })
  }

  /**
   * Suspend tenant
   */
  async suspendTenant(tenant_id: string, reason?: string) {
    return await this.updateTenants({
      id: tenant_id,
      status: "suspended",
      metadata: { suspension_reason: reason },
    })
  }
}

export default TenantModuleService
