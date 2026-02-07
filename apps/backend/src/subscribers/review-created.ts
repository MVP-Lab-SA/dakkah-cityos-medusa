import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function reviewCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; product_id?: string; vendor_id?: string; rating: number }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    // Get review details
    const reviewService = container.resolve("review")
    const review = await reviewService.retrieveReviews(data.id)
    
    // Admin notification for moderation
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "New Review Submitted",
        description: `${data.rating} star review submitted${data.product_id ? " for product" : ""}${data.vendor_id ? " for vendor" : ""}`,
      }
    })
    
    // If it's a low rating, escalate
    if (data.rating <= 2) {
      await notificationService.createNotifications({
        to: "",
        channel: "feed",
        template: "admin-ui",
        data: {
          title: "Low Rating Alert",
          description: `A ${data.rating}-star review requires attention`,
        }
      })
    }
    
    // Notify vendor if vendor review
    if (data.vendor_id) {
      const { data: vendors } = await query.graph({
        entity: "vendor",
        fields: ["contact_email", "name"],
        filters: { id: data.vendor_id }
      })
      
      const vendor = vendors?.[0]
      
      if (vendor?.contact_email) {
        await notificationService.createNotifications({
          to: vendor.contact_email,
          channel: "email",
          template: "vendor-new-review",
          data: {
            vendor_name: vendor.name,
            rating: data.rating,
            review_content: review?.content,
            dashboard_url: `${process.env.STOREFRONT_URL || ""}/vendor/reviews`,
          }
        })
      }
    }
    
    console.log(`[Review Created] ${data.id} - ${data.rating} stars`)
  } catch (error) {
    console.error("[Review Created] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "review.created",
}
