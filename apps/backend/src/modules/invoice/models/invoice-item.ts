import { model } from "@medusajs/framework/utils"
import { Invoice } from "./invoice.js"

export const InvoiceItem = model.define("invoice_item", {
  id: model.id().primaryKey(),
  invoice: model.belongsTo(() => Invoice, { mappedBy: "items" }),
  
  // Item details
  title: model.text(),
  description: model.text().nullable(),
  
  // Order reference
  order_id: model.text().nullable(),
  order_display_id: model.text().nullable(),
  
  // Amounts
  quantity: model.number().default(1),
  unit_price: model.bigNumber(),
  subtotal: model.bigNumber(),
  tax_total: model.bigNumber().default(0),
  total: model.bigNumber(),
  
  // Metadata
  metadata: model.json().nullable(),
})
