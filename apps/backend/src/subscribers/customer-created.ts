import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")

  try {
    // Fetch customer details
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "first_name", "last_name"],
      filters: { id: data.id },
    })

    const customer = customers[0]
    if (!customer || !customer.email) {
      console.log("[customer-created] Customer not found or no email:", data.id)
      return
    }

    // Send welcome email
    await notificationModuleService.createNotifications({
      to: customer.email,
      channel: "email",
      template: "customer-welcome",
      data: {
        customer_id: customer.id,
        customer_name: customer.first_name || "Customer",
        email: customer.email,
      },
    })

    console.log("[customer-created] Welcome email sent to:", customer.email)

    // Send admin notification
    await notificationModuleService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "New Customer",
        description: `${customer.first_name || ""} ${customer.last_name || ""} (${customer.email}) has registered`,
      },
    })
  } catch (error) {
    console.error("[customer-created] Failed to send notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
