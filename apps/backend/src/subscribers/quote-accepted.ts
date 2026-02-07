import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function quoteAcceptedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; customer_id?: string }>) {
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
        title: "Quote Accepted",
        description: `Quote #${quote?.display_id || quote?.id?.slice(0, 8)} accepted by ${customer?.email}`,
      }
    })
    
    // Confirm to customer
    if (customer?.email) {
      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "quote-accepted-confirmation",
        data: {
          customer_name: customer.first_name || "Customer",
          quote_id: quote.id,
          quote_number: quote.display_id || quote.id.slice(0, 8).toUpperCase(),
          total: quote.total,
          currency: quote.currency_code,
          next_steps: "Your order will be processed shortly. You will receive an order confirmation email.",
        }
      })
    }
    
    console.log(`[Quote Accepted] ${quote?.id}`)
  } catch (error) {
    console.error("[Quote Accepted] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "quote.accepted",
}
