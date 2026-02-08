import { model } from "@medusajs/framework/utils"

const SalesChannelMapping = model.define("sales_channel_mapping", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),

  channel_type: model.enum(["web", "mobile", "api", "kiosk", "internal"]),

  medusa_sales_channel_id: model.text().nullable(),

  name: model.text(),
  description: model.text().nullable(),

  node_id: model.text().nullable(),

  config: model.json().nullable(),

  is_active: model.boolean().default(true),

  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["tenant_id", "channel_type"] },
  { on: ["medusa_sales_channel_id"] },
  { on: ["node_id"] },
])

export default SalesChannelMapping
