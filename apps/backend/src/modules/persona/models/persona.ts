import { model } from "@medusajs/framework/utils"

const Persona = model.define("persona", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),

  name: model.text(),
  slug: model.text(),

  category: model.enum(["consumer", "creator", "business", "cityops", "platform"]),

  axes: model.json().nullable(),

  constraints: model.json().nullable(),

  allowed_workflows: model.json().nullable(),
  allowed_tools: model.json().nullable(),
  allowed_surfaces: model.json().nullable(),
  feature_overrides: model.json().nullable(),

  priority: model.number().default(0),
  status: model.enum(["active", "inactive"]).default("active"),
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["tenant_id", "slug"], unique: true },
  { on: ["category"] },
  { on: ["status"] },
])

export default Persona
