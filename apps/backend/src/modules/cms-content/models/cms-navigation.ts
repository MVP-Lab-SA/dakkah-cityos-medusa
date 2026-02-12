// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const CmsNavigation = model.define("cms_navigation", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  locale: model.text().default("en"),
  location: model.enum(["header", "footer", "sidebar", "mobile"]),
  items: model.json().default([]),
  status: model.enum(["active", "inactive"]).default("active"),
  metadata: model.json().nullable(),
})

export default CmsNavigation
