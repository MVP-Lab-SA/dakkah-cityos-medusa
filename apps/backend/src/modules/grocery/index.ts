import GroceryModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const GROCERY_MODULE = "grocery"

export default Module(GROCERY_MODULE, {
  service: GroceryModuleService,
})
