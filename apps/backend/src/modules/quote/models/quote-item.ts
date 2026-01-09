import { model } from "@medusajs/framework/utils";

/**
 * Quote Line Item
 * 
 * Individual products/variants in a quote.
 * Can have custom pricing different from catalog.
 */
const QuoteItem = model.define("quote_item", {
  id: model.id().primaryKey(),
  
  // Relationships
  quote_id: model.text(),
  product_id: model.text(),
  variant_id: model.text(),
  
  // Product Info (snapshot at time of quote)
  title: model.text(),
  description: model.text().nullable(),
  sku: model.text().nullable(),
  thumbnail: model.text().nullable(),
  
  // Quantity & Pricing
  quantity: model.number(),
  unit_price: model.bigNumber(), // catalog price
  custom_unit_price: model.bigNumber().nullable(), // negotiated price
  subtotal: model.bigNumber(),
  discount_total: model.bigNumber().default("0"),
  tax_total: model.bigNumber().default("0"),
  total: model.bigNumber(),
  
  // Discounts
  discount_percentage: model.number().nullable(),
  discount_reason: model.text().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
});

export default QuoteItem;
