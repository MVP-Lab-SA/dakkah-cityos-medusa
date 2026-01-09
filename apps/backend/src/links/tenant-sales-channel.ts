import { defineLink } from "@medusajs/framework/utils"
import TenantModule from "../modules/tenant"
import SalesChannelModule from "@medusajs/medusa/sales-channel"

/**
 * Link: Tenant ↔ Sales Channel
 * One tenant can have multiple sales channels
 * Each sales channel belongs to one tenant
 */
export default defineLink(
  TenantModule.linkable.tenant,
  {
    linkable: SalesChannelModule.linkable.salesChannel,
    isList: true, // tenant has many sales channels
  }
)
