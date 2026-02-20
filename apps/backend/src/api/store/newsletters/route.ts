import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../lib/api-error-handler";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    return res.json({
      items: [
        {
          id: "nl_1",
          title: "Weekly Deals & Offers",
          description: "Get exclusive deals delivered every week",
          frequency: "weekly",
          subscriber_count: 12500,
          category: "deals",
        },
        {
          id: "nl_2",
          title: "New Arrivals",
          description: "Be first to know about new products",
          frequency: "weekly",
          subscriber_count: 8300,
          category: "products",
        },
        {
          id: "nl_3",
          title: "Community Events",
          description: "Stay updated on events near you",
          frequency: "monthly",
          subscriber_count: 5200,
          category: "events",
        },
      ],
      count: 3,
    });
  } catch (error: any) {
    handleApiError(res, error, "GET store newsletters");
  }
}

// POST /store/newsletters — subscribe to a newsletter (migrated from /store/newsletter)
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, tenant_id } = req.body as { email: string; tenant_id: string };

  if (!email || !tenant_id) {
    return res
      .status(400)
      .json({ message: "email and tenant_id are required" });
  }

  try {
    const notifService = req.scope.resolve("notificationPreferences") as any;
    const customerId = req.auth_context?.actor_id;
    const subscriberId = customerId || `anon_${email}`;

    const result = await notifService.updatePreference({
      customerId: subscriberId,
      tenantId: tenant_id,
      channel: "email",
      eventType: "newsletter",
      enabled: true,
      frequency: "weekly_digest",
    });

    res.status(201).json({
      success: true,
      subscription: {
        id: result.id,
        email,
        channel: "email",
        event_type: "newsletter",
        subscribed: true,
      },
    });
  } catch (error: any) {
    handleApiError(res, error, "POST store newsletters");
  }
}
