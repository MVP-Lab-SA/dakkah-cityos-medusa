import { model } from "@medusajs/framework/utils"

const Translation = model.define("translation", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),

  locale: model.text(),
  namespace: model.text().default("common"),
  key: model.text(),
  value: model.text(),

  context: model.text().nullable(),

  status: model.enum(["draft", "published", "archived"]).default("published"),

  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id", "locale", "namespace", "key"], unique: true },
  { on: ["tenant_id", "locale"] },
  { on: ["namespace"] },
])

export default Translation
