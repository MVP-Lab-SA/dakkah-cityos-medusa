import { model } from "@medusajs/framework/utils";

const SubscriptionItem = model.define("subscription_item", {
  id: model.id().primaryKey(),
  subscription_id: model.text(),
  
  // Product reference
  product_id: model.text(),
  variant_id: model.text(),
  product_title: model.text(),
  variant_title: model.text().nullable(),
  
  // Quantity and pricing
  quantity: model.number().default(1),
  unit_price: model.bigNumber(),
  subtotal: model.bigNumber(),
  tax_total: model.bigNumber().default(0),
  total: model.bigNumber(),
  
  // Item-specific billing (optional override)
  billing_interval: model.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]).nullable(),
  billing_interval_count: model.number().nullable(),
  
  // Tenant isolation
  tenant_id: model.text(),
  
  // Metadata
  metadata: model.json().nullable(),
})
  .indexes([
    {
      on: ["subscription_id"],
      where: { deleted_at: null }
    },
    {
      on: ["tenant_id", "product_id"],
      where: { deleted_at: null }
    }
  ]);

export default SubscriptionItem;
