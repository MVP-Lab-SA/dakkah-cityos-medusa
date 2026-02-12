// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const CmsPage = model.define("cms_page", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  title: model.text(),
  slug: model.text(),
  locale: model.text().default("en"),
  status: model.text().default("draft"),
  template: model.text().nullable(),
  layout: model.json().default([]),
  seo_title: model.text().nullable(),
  seo_description: model.text().nullable(),
  seo_image: model.text().nullable(),
  country_code: model.text().nullable(),
  region_zone: model.text().nullable(),
  node_id: model.text().nullable(),
  published_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default CmsPage
