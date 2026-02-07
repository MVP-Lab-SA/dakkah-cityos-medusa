import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function vendorSuspendedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; reason?: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["*"],
      filters: { id: data.id }
    })
    
    const vendor = vendors?.[0]
    
    if (vendor?.contact_email) {
      await notificationService.createNotifications({
        to: vendor.contact_email,
        channel: "email",
        template: "vendor-suspended",
        data: {
          vendor_name: vendor.name,
          reason: data.reason || "Policy violation",
          appeal_url: `${process.env.STOREFRONT_URL || ""}/vendor/appeal`,
          support_email: process.env.SUPPORT_EMAIL || "support@example.com",
        }
      })
    }
    
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Vendor Suspended",
        description: `Vendor "${vendor?.name}" has been suspended: ${data.reason || "Policy violation"}`,
      }
    })
    
    console.log(`[Vendor Suspended] ${vendor?.id} - ${vendor?.name}`)
  } catch (error) {
    console.error("[Vendor Suspended] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "vendor.suspended",
}
