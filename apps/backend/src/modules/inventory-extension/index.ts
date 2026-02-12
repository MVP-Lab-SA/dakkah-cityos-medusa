import { Module } from "@medusajs/framework/utils"
import InventoryExtensionModuleService from "./service"

export const INVENTORY_EXTENSION_MODULE = "inventoryExtension"

export default Module(INVENTORY_EXTENSION_MODULE, {
  service: InventoryExtensionModuleService,
})
