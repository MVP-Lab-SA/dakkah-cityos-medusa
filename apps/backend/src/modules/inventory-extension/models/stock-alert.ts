// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const StockAlert = model.define("stock_alert", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  variant_id: model.text(),
  product_id: model.text(),
  alert_type: model.enum(["low_stock", "out_of_stock", "overstock", "reorder_point"]),
  threshold: model.number(),
  current_quantity: model.number().default(0),
  is_resolved: model.boolean().default(false),
  notified_at: model.dateTime().nullable(),
  resolved_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default StockAlert
