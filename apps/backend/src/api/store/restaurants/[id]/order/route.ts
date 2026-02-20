import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../../lib/api-error-handler";

/**
 * POST /store/restaurants/:id/order
 * Place a kitchen order for a restaurant.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const restaurantService = req.scope.resolve("restaurant") as any;
    const restaurantId = req.params.id;
    const { items } = req.body as {
      items: Array<{ menuItemId: string; quantity: number }>;
    };

    if (!items?.length) {
      return res.status(400).json({ error: "items array is required" });
    }

    const order = await restaurantService.placeOrder(restaurantId, items);
    return res.status(201).json({ order });
  } catch (error: any) {
    return handleApiError(res, error, "STORE-RESTAURANT-ORDER");
  }
}
