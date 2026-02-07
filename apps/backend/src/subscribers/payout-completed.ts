import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function payoutCompletedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; vendor_id: string; amount: number }>) {
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
        template: "payout-completed",
        data: {
          vendor_name: vendor.name,
          payout_number: payout?.payout_number,
          amount: payout?.net_amount || data.amount,
          period_start: payout?.period_start,
          period_end: payout?.period_end,
          transaction_count: payout?.transaction_count,
          dashboard_url: `${process.env.STOREFRONT_URL || ""}/vendor/payouts`,
        }
      })
    }
    
    console.log(`[Payout Completed] ${payout?.payout_number} - $${payout?.net_amount} to ${vendor?.name}`)
  } catch (error) {
    console.error("[Payout Completed] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "payout.completed",
}
