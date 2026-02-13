import GovernmentModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const GOVERNMENT_MODULE = "government"

export default Module(GOVERNMENT_MODULE, {
  service: GovernmentModuleService,
})
