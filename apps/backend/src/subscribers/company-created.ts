import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function companyCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: companies } = await query.graph({
      entity: "company",
      fields: ["*"],
      filters: { id: data.id }
    })
    
    const company = companies?.[0]
    
    if (company?.email) {
      await notificationService.createNotifications({
        to: company.email,
        channel: "email",
        template: "company-welcome",
        data: {
          company_name: company.name,
          tier: company.tier || "bronze",
          credit_limit: company.credit_limit || 0,
          payment_terms: company.payment_terms || "net_30",
          dashboard_url: `${process.env.STOREFRONT_URL || ""}/business`,
          getting_started_url: `${process.env.STOREFRONT_URL || ""}/business/getting-started`,
        }
      })
    }
    
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "New B2B Company",
        description: `New company registered: ${company?.name}`,
      }
    })
    
    console.log(`[Company Created] ${company?.id} - ${company?.name}`)
  } catch (error) {
    console.error("[Company Created] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "company.created",
}
