import { defineLink } from "@medusajs/framework/utils"
import NodeModule from "../modules/node"
import GovernanceModule from "../modules/governance"

export default defineLink(
  NodeModule.linkable.node,
  GovernanceModule.linkable.governanceAuthority
)
