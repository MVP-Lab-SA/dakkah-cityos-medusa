import { model } from "@medusajs/framework/utils"

const GovernanceAuthority = model.define("governance_authority", {
  id: model.id().primaryKey(),
  tenant_id: model.text().nullable(),
  
  name: model.text(),
  slug: model.text(),
  code: model.text().nullable(),
  
  type: model.enum(["region", "country", "authority"]),
  jurisdiction_level: model.number().default(0),
  
  parent_authority_id: model.text().nullable(),
  country_id: model.text().nullable(),
  region_id: model.text().nullable(),
  
  residency_zone: model.enum(["GCC", "EU", "MENA", "APAC", "AMERICAS", "GLOBAL"]).nullable(),
  
  policies: model.json().nullable(),
  
  status: model.enum(["active", "inactive"]).default("active"),
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["slug"] },
  { on: ["type"] },
  { on: ["parent_authority_id"] },
  { on: ["country_id"] },
  { on: ["region_id"] },
])

export default GovernanceAuthority
