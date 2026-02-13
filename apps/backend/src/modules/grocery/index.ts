import GroceryModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const GROCERY_MODULE = "grocery"

export default Module(GROCERY_MODULE, {
  service: GroceryModuleService,
})
