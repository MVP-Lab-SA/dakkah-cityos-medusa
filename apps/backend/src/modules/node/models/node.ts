import { model } from "@medusajs/framework/utils"

const Node = model.define("node", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  
  name: model.text(),
  slug: model.text(),
  code: model.text().nullable(),
  
  type: model.enum(["CITY", "DISTRICT", "ZONE", "FACILITY", "ASSET"]),
  depth: model.number(),
  
  parent_id: model.text().nullable(),
  breadcrumbs: model.json().nullable(),
  
  location: model.json().nullable(),
  
  status: model.enum(["active", "inactive", "maintenance"]).default("active"),
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["tenant_id", "type"] },
  { on: ["tenant_id", "slug"], unique: true },
  { on: ["parent_id"] },
  { on: ["type", "depth"] },
])

export default Node
