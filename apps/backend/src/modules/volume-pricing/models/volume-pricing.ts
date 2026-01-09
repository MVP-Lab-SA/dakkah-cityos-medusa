import { model } from "@medusajs/framework/utils";

/**
 * Volume Pricing Rule
 * 
 * Define quantity-based or tier-based pricing discounts.
 * Allows B2B customers to get better pricing for bulk purchases.
 */
const VolumePricing = model.define("volume_pricing", {
  id: model.id().primaryKey(),
  
  // Name & Description
  name: model.text(),
  description: model.text().nullable(),
  
  // Scope
  applies_to: model.enum([
    "product",        // Specific product
    "variant",        // Specific variant
    "collection",     // Product collection
    "category",       // Product category
    "all"            // Store-wide
  ]),
  
  // Target (depends on applies_to)
  target_id: model.text().nullable(), // product_id, variant_id, collection_id, etc
  
  // Pricing Type
  pricing_type: model.enum([
    "percentage",  // X% off
    "fixed",       // $X off per unit
    "fixed_price"  // Set price to $X
  ]),
  
  // Company Restriction (optional - can be for specific companies only)
  company_id: model.text().nullable(),
  company_tier: model.text().nullable(), // e.g., "gold", "platinum"
  
  // Multi-tenancy
  tenant_id: model.text(),
  store_id: model.text().nullable(),
  region_id: model.text().nullable(),
  
  // Priority (higher = applied first)
  priority: model.number().default(0),
  
  // Status
  status: model.enum(["active", "inactive", "scheduled"]).default("active"),
  
  // Scheduling
  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
});

export default VolumePricing;
