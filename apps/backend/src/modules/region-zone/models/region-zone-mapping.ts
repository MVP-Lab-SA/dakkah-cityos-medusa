import { model } from "@medusajs/framework/utils"

const RegionZoneMapping = model.define("region_zone_mapping", {
  id: model.id().primaryKey(),

  residency_zone: model.enum(["GCC", "EU", "MENA", "APAC", "AMERICAS", "GLOBAL"]),

  medusa_region_id: model.text(),

  country_codes: model.json().nullable(),

  policies_override: model.json().nullable(),

  metadata: model.json().nullable(),
})
.indexes([
  { on: ["residency_zone"] },
  { on: ["medusa_region_id"] },
])

export default RegionZoneMapping
