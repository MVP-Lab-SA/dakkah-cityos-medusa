import CommissionModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const COMMISSION_MODULE = "commission"

export default Module(COMMISSION_MODULE, {
  service: CommissionModuleService,
})
