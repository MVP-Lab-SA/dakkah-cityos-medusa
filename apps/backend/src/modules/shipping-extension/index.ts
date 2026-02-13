import { Module } from "@medusajs/framework/utils"
import ShippingExtensionModuleService from "./service.js"

export const SHIPPING_EXTENSION_MODULE = "shippingExtension"

export default Module(SHIPPING_EXTENSION_MODULE, {
  service: ShippingExtensionModuleService,
})
