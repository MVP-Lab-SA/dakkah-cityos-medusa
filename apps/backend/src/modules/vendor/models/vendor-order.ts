import { model } from "@medusajs/framework/utils"

export const VendorOrder = model.define("vendor_order", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),
  order_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Order Reference
  vendor_order_number: model.text().unique(),
  
  // Status
  status: model.enum([
    "pending",
    "acknowledged",
    "processing",
    "ready_to_ship",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
    "returned",
    "disputed"
  ]).default("pending"),
  
  // Pricing (Vendor's portion)
  currency_code: model.text().default("usd"),
  subtotal: model.bigNumber().default(0),
  shipping_total: model.bigNumber().default(0),
  tax_total: model.bigNumber().default(0),
  discount_total: model.bigNumber().default(0),
  total: model.bigNumber().default(0),
  
  // Commission
  commission_amount: model.bigNumber().default(0),
  platform_fee: model.bigNumber().default(0),
  net_amount: model.bigNumber().default(0), // Amount due to vendor
  
  // Payment
  payout_status: model.enum([
    "pending",
    "processing",
    "paid",
    "held",
    "disputed"
  ]).default("pending"),
  payout_id: model.text().nullable(),
  
  // Fulfillment
  fulfillment_status: model.enum([
    "not_fulfilled",
    "partially_fulfilled",
    "fulfilled",
    "returned"
  ]).default("not_fulfilled"),
  
  // Shipping
  shipping_method: model.text().nullable(),
  tracking_number: model.text().nullable(),
  tracking_url: model.text().nullable(),
  shipped_at: model.dateTime().nullable(),
  delivered_at: model.dateTime().nullable(),
  
  // Customer Info (for vendor to fulfill)
  shipping_address: model.json().nullable(),
  
  // Notes
  vendor_notes: model.text().nullable(),
  internal_notes: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["vendor_id"] },
  { on: ["order_id"] },
  { on: ["tenant_id", "vendor_id"] },
  { on: ["status"] },
  { on: ["payout_status"] },
])

export const VendorOrderItem = model.define("vendor_order_item", {
  id: model.id().primaryKey(),
  vendor_order_id: model.text(),
  line_item_id: model.text(), // Original order line item
  
  // Product Info
  product_id: model.text().nullable(),
  variant_id: model.text().nullable(),
  title: model.text(),
  sku: model.text().nullable(),
  thumbnail: model.text().nullable(),
  
  // Quantity
  quantity: model.number(),
  fulfilled_quantity: model.number().default(0),
  returned_quantity: model.number().default(0),
  
  // Pricing
  unit_price: model.bigNumber(),
  subtotal: model.bigNumber(),
  discount_amount: model.bigNumber().default(0),
  tax_amount: model.bigNumber().default(0),
  total: model.bigNumber(),
  
  // Vendor Cost/Commission
  vendor_cost: model.bigNumber().nullable(),
  commission_amount: model.bigNumber().default(0),
  net_amount: model.bigNumber().default(0),
  
  // Status
  status: model.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "returned",
    "cancelled"
  ]).default("pending"),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["vendor_order_id"] },
  { on: ["line_item_id"] },
  { on: ["product_id"] },
])
