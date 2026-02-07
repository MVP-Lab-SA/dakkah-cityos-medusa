import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function quoteDeclinedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; customer_id?: string; reason?: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: quotes } = await query.graph({
      entity: "quote",
      fields: ["*", "customer.*"],
      filters: { id: data.id }
    })
    
    const quote = quotes?.[0]
    const customer = quote?.customer
    
    // Notify admin
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Quote Declined",
        description: `Quote #${quote?.display_id || quote?.id?.slice(0, 8)} declined: ${data.reason || "No reason provided"}`,
      }
    })
    
    console.log(`[Quote Declined] ${quote?.id} - ${data.reason}`)
  } catch (error) {
    console.error("[Quote Declined] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "quote.declined",
}
