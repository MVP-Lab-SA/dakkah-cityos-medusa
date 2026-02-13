import CrowdfundingModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const CROWDFUNDING_MODULE = "crowdfunding"

export default Module(CROWDFUNDING_MODULE, {
  service: CrowdfundingModuleService,
})
