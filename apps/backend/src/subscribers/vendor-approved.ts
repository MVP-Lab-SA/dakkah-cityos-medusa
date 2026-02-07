import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function vendorApprovedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const vendorService = container.resolve("vendor")

  try {
    // Fetch vendor details
    const vendor = await vendorService.retrieveVendor(data.id)
    
    if (!vendor || !vendor.email) {
      console.log("[vendor-approved] Vendor not found or no email:", data.id)
      return
    }

    // Send approval notification email
    await notificationModuleService.createNotifications({
      to: vendor.email,
      channel: "email",
      template: "vendor-approved",
      data: {
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        email: vendor.email,
        store_url: process.env.STOREFRONT_URL || "",
      },
    })

    console.log("[vendor-approved] Approval email sent to:", vendor.email)

    // Send admin notification
    await notificationModuleService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Vendor Approved",
        description: `${vendor.name} has been approved as a vendor`,
      },
    })
  } catch (error) {
    console.error("[vendor-approved] Failed to send notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "vendor.approved",
}
