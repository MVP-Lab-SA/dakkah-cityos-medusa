import { model } from "@medusajs/framework/utils";

/**
 * Volume Pricing Tier
 * 
 * Defines quantity breakpoints and corresponding discounts.
 * Example: 1-10 units = 0%, 11-50 = 10%, 51+ = 20%
 */
const VolumePricingTier = model.define("volume_pricing_tier", {
  id: model.id().primaryKey(),
  
  // Parent Rule
  volume_pricing_id: model.text(),
  
  // Quantity Range
  min_quantity: model.number(),
  max_quantity: model.number().nullable(), // null = infinity
  
  // Discount
  discount_percentage: model.number().nullable(), // for "percentage" type
  discount_amount: model.bigNumber().nullable(),  // for "fixed" type
  fixed_price: model.bigNumber().nullable(),      // for "fixed_price" type
  
  // Currency (for fixed amounts)
  currency_code: model.text().default("usd"),
  
  // Metadata
  metadata: model.json().nullable(),
  
  // Timestamps
  created_at: model.dateTime().defaultNow(),
  updated_at: model.dateTime().defaultNow(),
});

export default VolumePricingTier;
