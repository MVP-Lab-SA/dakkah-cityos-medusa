import { Module } from "@medusajs/framework/utils"
import CMSContentModuleService from "./service"

export const CMS_CONTENT_MODULE = "cmsContent"

export default Module(CMS_CONTENT_MODULE, {
  service: CMSContentModuleService,
})
