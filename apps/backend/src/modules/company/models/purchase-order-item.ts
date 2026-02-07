import { model } from "@medusajs/framework/utils"

export const PurchaseOrderItem = model.define("purchase_order_item", {
  id: model.id().primaryKey(),
  purchase_order_id: model.text(),
  
  // Product Reference
  product_id: model.text().nullable(),
  variant_id: model.text().nullable(),
  
  // Product Snapshot
  title: model.text(),
  description: model.text().nullable(),
  sku: model.text().nullable(),
  barcode: model.text().nullable(),
  thumbnail: model.text().nullable(),
  
  // Quantity
  quantity: model.number(),
  fulfilled_quantity: model.number().default(0),
  
  // Pricing
  unit_price: model.bigNumber(),
  original_price: model.bigNumber().nullable(),
  discount_amount: model.bigNumber().default(0),
  tax_amount: model.bigNumber().default(0),
  subtotal: model.bigNumber(),
  total: model.bigNumber(),
  
  // Line Item Status
  status: model.enum([
    "pending",
    "confirmed",
    "partially_fulfilled",
    "fulfilled",
    "cancelled",
    "backordered"
  ]).default("pending"),
  
  // Delivery
  expected_ship_date: model.dateTime().nullable(),
  actual_ship_date: model.dateTime().nullable(),
  tracking_number: model.text().nullable(),
  
  // Notes
  notes: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["purchase_order_id"] },
  { on: ["product_id"] },
  { on: ["variant_id"] },
])
