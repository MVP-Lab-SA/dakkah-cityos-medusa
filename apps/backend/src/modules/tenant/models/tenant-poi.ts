import { model } from "@medusajs/framework/utils"

const TenantPOI = model.define("tenant_poi", {
  id: model.id().primaryKey(),
  
  tenant_id: model.text(),
  node_id: model.text().nullable(),
  
  name: model.text(),
  slug: model.text(),
  poi_type: model.enum(["storefront", "warehouse", "fulfillment_hub", "service_point", "office", "branch", "kiosk", "mobile"]).default("storefront"),
  
  address_line1: model.text(),
  address_line2: model.text().nullable(),
  city: model.text(),
  state: model.text().nullable(),
  postal_code: model.text(),
  country_code: model.text(),
  
  latitude: model.number().nullable(),
  longitude: model.number().nullable(),
  geohash: model.text().nullable(),
  
  operating_hours: model.json().nullable(),
  
  phone: model.text().nullable(),
  email: model.text().nullable(),
  
  is_primary: model.boolean().default(false),
  is_active: model.boolean().default(true),
  
  service_radius_km: model.number().nullable(),
  delivery_zones: model.json().nullable(),
  
  fleetbase_place_id: model.text().nullable(),
  
  media: model.json().nullable(),
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["node_id"] },
  { on: ["country_code"] },
  { on: ["tenant_id", "is_primary"] },
])

export default TenantPOI
