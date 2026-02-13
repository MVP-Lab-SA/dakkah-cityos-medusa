import WarrantyModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const WARRANTY_MODULE = "warranty"

export default Module(WARRANTY_MODULE, {
  service: WarrantyModuleService,
})
