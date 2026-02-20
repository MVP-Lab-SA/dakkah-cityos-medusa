import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../../lib/api-error-handler";

/**
 * GET /admin/inventory/serialized
 * Lists serialized inventory items with optional condition/status filter.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const inventoryExtService = req.scope.resolve("inventory-extension") as any;
    const {
      status,
      condition,
      limit = "50",
      offset = "0",
    } = req.query as {
      status?: string;
      condition?: string;
      limit?: string;
      offset?: string;
    };

    const filters: any = {};
    if (status) filters.status = status;
    if (condition) filters.condition = condition;

    let items: any[] = [];
    if (typeof inventoryExtService.listSerializedItems === "function") {
      items = await inventoryExtService.listSerializedItems(filters, {
        take: Number(limit),
        skip: Number(offset),
      });
    } else {
      const all =
        (await (inventoryExtService as any).listSerializedInventories?.(
          filters,
        )) ?? [];
      items = Array.isArray(all) ? all : [all].filter(Boolean);
    }

    return res.json({
      items,
      count: items.length,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-INVENTORY-SERIALIZED");
  }
}
