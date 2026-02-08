import { model } from "@medusajs/framework/utils"

const Menu = model.define("menu", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  restaurant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  menu_type: model.enum(["regular", "breakfast", "lunch", "dinner", "drinks", "dessert", "special"]),
  is_active: model.boolean().default(true),
  display_order: model.number().default(0),
  available_from: model.text().nullable(),
  available_until: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Menu
