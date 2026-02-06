import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import type { SubscriptionModuleService, ExtendedRequest } from "../../types";
import { createSubscriptionWorkflow } from "../../../workflows/subscription/create-subscription-workflow";

const createSubscriptionSchema = z.object({
  customer_id: z.string(),
  billing_interval: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]),
  billing_interval_count: z.number().optional(),
  billing_anchor_day: z.number().min(0).max(31).optional(),
  payment_collection_method: z.enum(["charge_automatically", "send_invoice"]).optional(),
  payment_method_id: z.string().optional(),
  trial_days: z.number().optional(),
  items: z.array(
    z.object({
      product_id: z.string(),
      variant_id: z.string(),
      quantity: z.number().min(1),
    })
  ),
  metadata: z.record(z.any()).optional(),
});

// GET /admin/subscriptions - List subscriptions
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionModule = req.scope.resolve("subscription") as SubscriptionModuleService;
  const extReq = req as ExtendedRequest;
  const tenantId = extReq.tenant?.id;
  
  const { offset = 0, limit = 20, status, customer_id } = req.query as Record<string, string>;
  
  const filters: Record<string, unknown> = {};
  if (tenantId) filters.tenant_id = tenantId;
  if (status) filters.status = status;
  if (customer_id) filters.customer_id = customer_id;
  
  const [subscriptions, count] = await subscriptionModule.listAndCountSubscriptions(filters, {
    skip: Number(offset),
    take: Number(limit),
    relations: ["subscription_items"],
    order: { created_at: "DESC" },
  });
  
  res.json({
    subscriptions,
    count,
    offset: Number(offset),
    limit: Number(limit),
  });
}

// POST /admin/subscriptions - Create subscription
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const extReq = req as ExtendedRequest;
  const tenantId = extReq.tenant?.id;
  const storeId = extReq.store?.id;
  
  const validatedData = createSubscriptionSchema.parse(req.body);
  
  const { result } = await createSubscriptionWorkflow(req.scope).run({
    input: {
      ...validatedData,
      tenant_id: tenantId,
      store_id: storeId,
    },
  });
  
  res.status(201).json({ subscription: result.subscription });
}
