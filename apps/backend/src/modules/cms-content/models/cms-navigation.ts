// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const CmsNavigation = model.define("cms_navigation", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  locale: model.text().default("en"),
  location: model.text(),
  items: model.json().default([]),
  status: model.text().default("active"),
  metadata: model.json().nullable(),
})

export default CmsNavigation
