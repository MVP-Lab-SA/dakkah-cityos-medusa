import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function purchaseOrderSubmittedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; company_id?: string; submitted_by?: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: purchaseOrders } = await query.graph({
      entity: "purchase_order",
      fields: ["*", "company.*", "customer.*"],
      filters: { id: data.id }
    })
    
    const po = purchaseOrders?.[0]
    const company = po?.company
    const customer = po?.customer
    
    // Notify admin for approval
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Purchase Order Submitted",
        description: `PO #${po?.po_number || po?.id?.slice(0, 8)} from ${company?.name} requires approval`,
      }
    })
    
    // Confirm submission to customer
    if (customer?.email) {
      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "purchase-order-submitted",
        data: {
          customer_name: customer.first_name || "Customer",
          po_number: po.po_number || po.id.slice(0, 8).toUpperCase(),
          company_name: company?.name,
          total: po.total,
          currency: po.currency_code || "usd",
          status: "Pending Approval",
          approval_info: "Your purchase order has been submitted and is pending approval.",
          track_url: `${process.env.STOREFRONT_URL || ""}/business/purchase-orders/${po.id}`,
        }
      })
    }
    
    // Notify company admin if different from submitter
    if (company?.email && company.email !== customer?.email) {
      await notificationService.createNotifications({
        to: company.email,
        channel: "email",
        template: "purchase-order-approval-needed",
        data: {
          company_name: company.name,
          po_number: po.po_number || po.id.slice(0, 8).toUpperCase(),
          submitted_by: customer?.email,
          total: po.total,
          approve_url: `${process.env.STOREFRONT_URL || ""}/business/purchase-orders/${po.id}/approve`,
        }
      })
    }
    
    console.log(`[Purchase Order Submitted] ${po?.po_number || po?.id}`)
  } catch (error) {
    console.error("[Purchase Order Submitted] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "purchase_order.submitted",
}
