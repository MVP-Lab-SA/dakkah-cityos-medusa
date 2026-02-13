import { Module } from "@medusajs/framework/utils"
import GovernanceModuleService from "./service.js"

export const GOVERNANCE_MODULE = "governance"

export default Module(GOVERNANCE_MODULE, {
  service: GovernanceModuleService,
})
