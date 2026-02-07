import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function invoiceGenerationJob(container: MedusaContainer) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const invoiceService = container.resolve("invoice") as any
  const eventBus = container.resolve(Modules.EVENT_BUS)
  
  logger.info("[Invoice Generation] Starting monthly invoice generation...")
  
  try {
    // Get all companies that need monthly invoices
    const { data: companies } = await query.graph({
      entity: "company",
      fields: ["id", "name", "email", "payment_terms", "metadata"],
      filters: {
        is_verified: true,
        payment_terms: { $in: ["net_15", "net_30", "net_45", "net_60"] }
      }
    })
    
    if (!companies || companies.length === 0) {
      logger.info("[Invoice Generation] No companies need invoices")
      return
    }
    
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    
    let generatedCount = 0
    let errorCount = 0
    
    for (const company of companies) {
      try {
        // Get orders for this company from last month
        const { data: orders } = await query.graph({
          entity: "order",
          fields: ["id", "display_id", "total", "created_at", "currency_code"],
          filters: {
            metadata: { company_id: company.id },
            status: "completed",
            created_at: {
              $gte: lastMonth.toISOString(),
              $lte: lastMonthEnd.toISOString()
            }
          }
        })
        
        if (!orders || orders.length === 0) {
          continue
        }
        
        // Calculate payment terms days
        const paymentTermsDays = parseInt(company.payment_terms?.replace("net_", "") || "30")
        const dueDate = new Date(now.getTime() + paymentTermsDays * 24 * 60 * 60 * 1000)
        
        // Prepare invoice items from orders
        const invoiceItems = orders.map((order: any) => ({
          title: `Order #${order.display_id}`,
          description: `Order placed on ${new Date(order.created_at).toLocaleDateString()}`,
          order_id: order.id,
          order_display_id: String(order.display_id),
          quantity: 1,
          unit_price: Number(order.total),
        }))
        
        // Create invoice with items using the service
        const { invoice, items } = await invoiceService.createInvoiceWithItems({
          company_id: company.id,
          issue_date: now,
          due_date: dueDate,
          period_start: lastMonth,
          period_end: lastMonthEnd,
          payment_terms: company.payment_terms,
          payment_terms_days: paymentTermsDays,
          currency_code: orders[0]?.currency_code || "usd",
          notes: `Monthly invoice for ${lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
          items: invoiceItems,
          metadata: {
            generated_by: "invoice-generation-job",
            order_count: orders.length,
          }
        })
        
        // Mark as sent (in a real scenario, you'd send an email first)
        await invoiceService.markAsSent(invoice.id)
        
        logger.info(`[Invoice Generation] Created ${invoice.invoice_number} for ${company.name}: $${invoice.total} (${items.length} items)`)
        
        // Emit event for notification
        await eventBus.emit("invoice.created", {
          invoice_id: invoice.id,
          company_id: company.id,
          invoice_number: invoice.invoice_number,
          total: invoice.total,
          due_date: dueDate,
        })
        
        generatedCount++
      } catch (error: any) {
        logger.error(`[Invoice Generation] Failed for company ${company.name}: ${error.message}`)
        errorCount++
      }
    }
    
    logger.info(`[Invoice Generation] Completed: ${generatedCount} invoices generated, ${errorCount} errors`)
    
    // Also mark any overdue invoices
    const overdueInvoices = await invoiceService.markOverdueInvoices()
    if (overdueInvoices.length > 0) {
      logger.info(`[Invoice Generation] Marked ${overdueInvoices.length} invoices as overdue`)
      
      // Emit events for overdue invoices
      for (const invoice of overdueInvoices) {
        await eventBus.emit("invoice.overdue", {
          invoice_id: invoice.id,
          company_id: invoice.company_id,
          invoice_number: invoice.invoice_number,
          amount_due: invoice.amount_due,
        })
      }
    }
  } catch (error: any) {
    logger.error(`[Invoice Generation] Job failed: ${error.message}`)
    throw error
  }
}

export const config = {
  name: "invoice-generation",
  schedule: "0 4 1 * *", // 1st of every month at 4 AM
}
