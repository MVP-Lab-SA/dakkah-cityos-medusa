import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, tenant_id } = req.body as { email: string; tenant_id: string }

  if (!email || !tenant_id) {
    return res.status(400).json({ message: "email and tenant_id are required" })
  }

  try {
    const notifService = req.scope.resolve("notificationPreferences") as any
    const customerId = req.auth_context?.actor_id

    const subscriberId = customerId || `anon_${email}`

    const result = await notifService.updatePreference({
      customerId: subscriberId,
      tenantId: tenant_id,
      channel: "email",
      eventType: "newsletter",
      enabled: true,
      frequency: "weekly_digest",
    })

    res.status(201).json({
      success: true,
      subscription: {
        id: result.id,
        email,
        channel: "email",
        event_type: "newsletter",
        subscribed: true,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to subscribe to newsletter", error: error.message })
  }
}
