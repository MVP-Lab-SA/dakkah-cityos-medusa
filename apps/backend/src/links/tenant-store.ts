import { defineLink } from "@medusajs/framework/utils"
import TenantModule from "../modules/tenant.js"
import StoreModule from "../modules/store.js"

export default defineLink(
  TenantModule.linkable.tenant,
  StoreModule.linkable.cityosStore
)
