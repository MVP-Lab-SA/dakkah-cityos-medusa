import CharityModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const CHARITY_MODULE = "charity"

export default Module(CHARITY_MODULE, {
  service: CharityModuleService,
})
