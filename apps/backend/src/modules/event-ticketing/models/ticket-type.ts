import { model } from "@medusajs/framework/utils"

const TicketType = model.define("ticket_type", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  event_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  price: model.bigNumber(),
  currency_code: model.text(),
  quantity_total: model.number(),
  quantity_sold: model.number().default(0),
  quantity_reserved: model.number().default(0),
  max_per_order: model.number().default(10),
  sale_starts_at: model.dateTime().nullable(),
  sale_ends_at: model.dateTime().nullable(),
  is_active: model.boolean().default(true),
  includes: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default TicketType
