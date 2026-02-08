import { model } from "@medusajs/framework/utils"

const DigitalAsset = model.define("digital_asset", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  product_id: model.text(),
  title: model.text(),
  file_url: model.text(),
  file_type: model.enum(["pdf", "video", "audio", "image", "archive", "ebook", "software", "other"]),
  file_size_bytes: model.number().nullable(),
  preview_url: model.text().nullable(),
  version: model.text().default("1.0"),
  max_downloads: model.number().default(-1),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default DigitalAsset
