import { model } from "@medusajs/framework/utils"

const DownloadLicense = model.define("download_license", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  asset_id: model.text(),
  customer_id: model.text(),
  order_id: model.text(),
  license_key: model.text().unique(),
  status: model.enum(["active", "expired", "revoked"]).default("active"),
  download_count: model.number().default(0),
  max_downloads: model.number().default(-1),
  first_downloaded_at: model.dateTime().nullable(),
  last_downloaded_at: model.dateTime().nullable(),
  expires_at: model.dateTime().nullable(),
  revoked_at: model.dateTime().nullable(),
  revoke_reason: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default DownloadLicense
