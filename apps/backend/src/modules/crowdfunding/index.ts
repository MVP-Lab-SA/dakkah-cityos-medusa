import CrowdfundingModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CROWDFUNDING_MODULE = "crowdfunding"

export default Module(CROWDFUNDING_MODULE, {
  service: CrowdfundingModuleService,
})
