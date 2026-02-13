import { Module } from "@medusajs/framework/utils"
import StoreModuleService from "./service.js"

export const STORE_MODULE = "cityosStore"

export default Module(STORE_MODULE, {
  service: StoreModuleService,
})

export * from "./models.js"
