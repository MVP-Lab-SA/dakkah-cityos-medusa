import { Module } from "@medusajs/framework/utils"
import I18nModuleService from "./service.js"

export const I18N_MODULE = "i18n"

export default Module(I18N_MODULE, {
  service: I18nModuleService,
})
