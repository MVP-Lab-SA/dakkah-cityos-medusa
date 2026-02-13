import { Module } from "@medusajs/framework/utils"
import TaxConfigModuleService from "./service.js"

export const TAX_CONFIG_MODULE = "taxConfig"

export default Module(TAX_CONFIG_MODULE, {
  service: TaxConfigModuleService,
})
