import { model } from "@medusajs/framework/utils"

const ModifierGroup = model.define("modifier_group", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  restaurant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  selection_type: model.enum(["single", "multiple"]),
  min_selections: model.number().default(0),
  max_selections: model.number().nullable(),
  is_required: model.boolean().default(false),
  display_order: model.number().default(0),
  metadata: model.json().nullable(),
})

export default ModifierGroup
