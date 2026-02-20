import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../../../lib/api-error-handler";

/**
 * POST /store/campaigns/:id/pledge  — create a pledge for a campaign
 * GET  /store/campaigns/:id/pledge  — get the customer's pledge for this campaign
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const crowdfundingService = req.scope.resolve("crowdfunding") as any;
    const customerId = (req as any).auth_context?.actor_id;
    const campaignId = req.params.id;

    if (!customerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const {
      amount,
      reward_tier_id,
      anonymous = false,
    } = req.body as {
      amount: number;
      reward_tier_id?: string;
      anonymous?: boolean;
    };

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "amount must be greater than 0" });
    }

    // Verify campaign exists and is active
    const campaign = await (crowdfundingService as any).retrieveCampaign(
      campaignId,
    );
    if ((campaign as any).status !== "active") {
      return res
        .status(400)
        .json({ error: "Campaign is not accepting pledges" });
    }

    const pledge = await (crowdfundingService as any).createPledges({
      campaign_id: campaignId,
      backer_id: customerId,
      amount,
      reward_tier_id: reward_tier_id ?? null,
      anonymous,
      status: "pending",
      pledged_at: new Date(),
    });

    // Update campaign current_amount
    await (crowdfundingService as any).updateCampaigns({
      id: campaignId,
      current_amount: Number((campaign as any).current_amount || 0) + amount,
    });

    return res.status(201).json({ pledge });
  } catch (error: any) {
    return handleApiError(res, error, "STORE-CAMPAIGN-PLEDGE-CREATE");
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const crowdfundingService = req.scope.resolve("crowdfunding") as any;
    const customerId = (req as any).auth_context?.actor_id;
    const campaignId = req.params.id;

    if (!customerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const pledges = await (crowdfundingService as any).listPledges({
      campaign_id: campaignId,
      backer_id: customerId,
    });
    const list = Array.isArray(pledges) ? pledges : [pledges].filter(Boolean);

    return res.json({ pledge: list[0] ?? null, pledges: list });
  } catch (error: any) {
    return handleApiError(res, error, "STORE-CAMPAIGN-PLEDGE-GET");
  }
}
