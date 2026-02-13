import LegalModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const LEGAL_MODULE = "legal"

export default Module(LEGAL_MODULE, {
  service: LegalModuleService,
})
