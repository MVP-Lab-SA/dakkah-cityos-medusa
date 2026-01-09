import { Module } from "@medusajs/framework/utils"
import StoreModuleService from "./service"

export const STORE_MODULE = "storeModuleService"

export default Module(STORE_MODULE, {
  service: StoreModuleService,
})

export * from "./models"
