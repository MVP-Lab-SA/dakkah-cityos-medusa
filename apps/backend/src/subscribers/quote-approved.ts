import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function quoteApprovedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const quoteService = container.resolve("quote")

  try {
    // Fetch quote details
    const quote = await quoteService.retrieveQuote(data.id)
    
    if (!quote || !quote.customer_email) {
      console.log("[quote-approved] Quote not found or no email:", data.id)
      return
    }

    // Send approval notification email
    await notificationModuleService.createNotifications({
      to: quote.customer_email,
      channel: "email",
      template: "quote-approved",
      data: {
        quote_id: quote.id,
        quote_number: quote.quote_number,
        total: quote.total,
        currency_code: quote.currency_code,
        valid_until: quote.valid_until,
        customer_name: quote.customer_name || "Customer",
        items: quote.items,
      },
    })

    console.log("[quote-approved] Approval email sent to:", quote.customer_email)

    // Send admin notification
    await notificationModuleService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Quote Approved",
        description: `Quote #${quote.quote_number} has been approved`,
      },
    })
  } catch (error) {
    console.error("[quote-approved] Failed to send notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "quote.approved",
}
