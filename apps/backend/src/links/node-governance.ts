import { defineLink } from "@medusajs/framework/utils"
import NodeModule from "../modules/node.js"
import GovernanceModule from "../modules/governance.js"

export default defineLink(
  NodeModule.linkable.node,
  GovernanceModule.linkable.governanceAuthority
)
