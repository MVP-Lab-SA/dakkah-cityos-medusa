import ClassifiedModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CLASSIFIED_MODULE = "classified"

export default Module(CLASSIFIED_MODULE, {
  service: ClassifiedModuleService,
})
