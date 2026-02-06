import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

/**
 * GET /store/volume-pricing/:productId
 * Get volume pricing tiers for a product
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const volumePricingService = req.scope.resolve("volumePricingModuleService") as any;
  const { productId } = req.params;

  try {
    // Find volume pricing rules for this product
    const rules = await volumePricingService.listVolumePricings(
      {
        $or: [
          { product_id: productId },
          { applies_to: "all" }, // Global rules
        ],
        is_active: true,
      }
    );

    // Sort tiers by min_quantity
    (rules || []).forEach((rule: any) => {
      if (rule.tiers) {
        rule.tiers.sort((a: any, b: any) => a.min_quantity - b.min_quantity);
      }
    });

    res.json({ rules: rules || [] });
  } catch (error) {
    console.error("Error fetching volume pricing:", error);
    res.json({ rules: [] });
  }
}
