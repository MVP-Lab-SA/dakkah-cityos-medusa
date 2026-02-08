import { model } from "@medusajs/framework/utils"

const PropertyDocument = model.define("property_document", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  listing_id: model.text().nullable(),
  lease_id: model.text().nullable(),
  document_type: model.enum(["title_deed", "floor_plan", "inspection", "contract", "insurance", "tax", "utility", "other"]),
  title: model.text(),
  file_url: model.text(),
  file_type: model.text().nullable(),
  uploaded_by: model.text().nullable(),
  is_verified: model.boolean().default(false),
  verified_by: model.text().nullable(),
  expires_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default PropertyDocument
