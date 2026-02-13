import { Module } from "@medusajs/framework/utils"
import CartExtensionModuleService from "./service.js"

export const CART_EXTENSION_MODULE = "cartExtension"

export default Module(CART_EXTENSION_MODULE, {
  service: CartExtensionModuleService,
})
