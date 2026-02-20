import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../lib/api-error-handler";

/**
 * GET  /store/campaigns  — list active public crowdfunding campaigns
 * POST /store/campaigns  — create a new campaign (auth required)
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const crowdfundingService = req.scope.resolve("crowdfunding") as any;
    const {
      limit = "20",
      offset = "0",
      status = "active",
    } = req.query as Record<string, string | undefined>;

    const campaigns = await (crowdfundingService as any).listCampaigns(
      { status },
      {
        skip: Number(offset),
        take: Number(limit),
      },
    );
    const list = Array.isArray(campaigns)
      ? campaigns
      : [campaigns].filter(Boolean);

    return res.json({
      campaigns: list,
      count: list.length,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error: any) {
    return handleApiError(res, error, "STORE-CAMPAIGNS-LIST");
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const crowdfundingService = req.scope.resolve("crowdfunding") as any;
    const customerId = (req as any).auth_context?.actor_id;

    if (!customerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const {
      title,
      description,
      goal_amount,
      currency_code = "usd",
      end_date,
    } = req.body as {
      title: string;
      description?: string;
      goal_amount: number;
      currency_code?: string;
      end_date?: string;
    };

    if (!title || !goal_amount || goal_amount <= 0) {
      return res
        .status(400)
        .json({ error: "title and goal_amount > 0 are required" });
    }

    const campaign = await (crowdfundingService as any).createCampaigns({
      title,
      description: description ?? null,
      goal_amount,
      current_amount: 0,
      currency_code,
      status: "draft",
      owner_id: customerId,
      end_date: end_date ? new Date(end_date) : null,
    });

    return res.status(201).json({ campaign });
  } catch (error: any) {
    return handleApiError(res, error, "STORE-CAMPAIGNS-CREATE");
  }
}
