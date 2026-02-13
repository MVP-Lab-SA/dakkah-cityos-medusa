import { Module } from "@medusajs/framework/utils"
import PersonaModuleService from "./service"

export const PERSONA_MODULE = "persona"

export default Module(PERSONA_MODULE, {
  service: PersonaModuleService,
})
