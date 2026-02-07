// @ts-nocheck
import { model } from "@medusajs/framework/utils"

export const Review = model.define("review", {
  id: model.id().primaryKey(),
  rating: model.number(),
  title: model.text().nullable(),
  content: model.text(),
  customer_id: model.text(),
  customer_name: model.text().nullable(),
  customer_email: model.text().nullable(),
  product_id: model.text().nullable(),
  vendor_id: model.text().nullable(),
  order_id: model.text().nullable(),
  is_verified_purchase: model.boolean().default(false),
  is_approved: model.boolean().default(false),
  helpful_count: model.number().default(0),
  images: model.json().default([]),
  metadata: model.json().nullable(),
})
