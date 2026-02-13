import { defineLink } from "@medusajs/framework/utils"
import TenantModule from "../modules/tenant"
import StoreModule from "../modules/store"

export default defineLink(
  TenantModule.linkable.tenant,
  StoreModule.linkable.cityosStore
)
