import { defineLink } from "@medusajs/framework/utils"
import StoreModule from "../modules/store"
import TenantModule from "../modules/tenant"

/**
 * Link: Store ↔ Tenant
 * One store belongs to one tenant
 * One tenant can have multiple stores (multi-brand)
 */
export default defineLink(
  StoreModule.linkable.store,
  TenantModule.linkable.tenant
)
