import { MedusaService } from "@medusajs/framework/utils"
import Store from "./models/store"

/**
 * Store Module Service
 * Manages store operations within tenants
 */
class StoreModuleService extends MedusaService({
  Store,
}) {
  /**
   * Retrieve stores by tenant
   */
  async listStoresByTenant(tenant_id: string, filters?: any) {
    return await this.listStores({
      tenant_id,
      ...filters,
    })
  }

  /**
   * Retrieve store by subdomain
   */
  async retrieveStoreBySubdomain(subdomain: string) {
    const [stores] = await this.listStores({
      subdomain,
      status: ["active", "maintenance"],
    })
    return stores[0] || null
  }

  /**
   * Retrieve store by custom domain
   */
  async retrieveStoreByDomain(domain: string) {
    const [stores] = await this.listStores({
      custom_domain: domain,
      status: ["active", "maintenance"],
    })
    return stores[0] || null
  }

  /**
   * Retrieve store by handle
   */
  async retrieveStoreByHandle(handle: string) {
    const [stores] = await this.listStores({
      handle,
    })
    return stores[0] || null
  }

  /**
   * Retrieve store by sales channel
   */
  async retrieveStoreBySalesChannel(sales_channel_id: string) {
    const [stores] = await this.listStores({
      sales_channel_id,
    })
    return stores[0] || null
  }

  /**
   * Activate store
   */
  async activateStore(store_id: string) {
    return await this.updateStores({
      id: store_id,
      status: "active",
    })
  }

  /**
   * Set store to maintenance mode
   */
  async setMaintenanceMode(store_id: string, enabled: boolean) {
    return await this.updateStores({
      id: store_id,
      status: enabled ? "maintenance" : "active",
    })
  }
}

export default StoreModuleService
