import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function payoutFailedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; vendor_id: string; error?: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["*"],
      filters: { id: data.vendor_id }
    })
    
    const vendor = vendors?.[0]
    
    const { data: payouts } = await query.graph({
      entity: "payout",
      fields: ["*"],
      filters: { id: data.id }
    })
    
    const payout = payouts?.[0]
    
    if (vendor?.contact_email) {
      await notificationService.createNotifications({
        to: vendor.contact_email,
        channel: "email",
        template: "payout-failed",
        data: {
          vendor_name: vendor.name,
          payout_number: payout?.payout_number,
          amount: payout?.net_amount,
          error: data.error || "Payout could not be processed",
          retry_info: "We will automatically retry in 24 hours",
          update_payment_url: `${process.env.STOREFRONT_URL || ""}/vendor/settings/payments`,
          support_email: process.env.SUPPORT_EMAIL || "support@example.com",
        }
      })
    }
    
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Payout Failed",
        description: `Payout ${payout?.payout_number} failed for ${vendor?.name}: ${data.error}`,
      }
    })
    
    console.log(`[Payout Failed] ${payout?.payout_number} - ${data.error}`)
  } catch (error) {
    console.error("[Payout Failed] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "payout.failed",
}
