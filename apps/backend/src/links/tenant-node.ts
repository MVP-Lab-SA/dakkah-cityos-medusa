import { defineLink } from "@medusajs/framework/utils"
import TenantModule from "../modules/tenant"
import NodeModule from "../modules/node"

export default defineLink(
  TenantModule.linkable.tenant,
  NodeModule.linkable.node
)
