import { defineLink } from "@medusajs/framework/utils"
import TenantModule from "../modules/tenant.js"
import NodeModule from "../modules/node.js"

export default defineLink(
  TenantModule.linkable.tenant,
  NodeModule.linkable.node
)
