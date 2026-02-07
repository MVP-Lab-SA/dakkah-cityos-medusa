import { MedusaContainer } from "@medusajs/framework/types"

export default async function invoiceGenerationJob(container: MedusaContainer) {
  const query = container.resolve("query")
  
  console.log("[Invoice Generation] Starting monthly invoice generation...")
  
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
      console.log("[Invoice Generation] No companies need invoices")
      return
    }
    
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    
    let generatedCount = 0
    
    for (const company of companies) {
      try {
        // Get orders for this company from last month
        const { data: orders } = await query.graph({
          entity: "order",
          fields: ["id", "display_id", "total", "created_at"],
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
        
        const totalAmount = orders.reduce((sum: number, o: any) => sum + Number(o.total), 0)
        
        // Generate invoice number
        const invoiceNumber = `INV-${company.id.slice(0, 4).toUpperCase()}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
        
        // Calculate due date based on payment terms
        const paymentTermsDays = parseInt(company.payment_terms?.replace("net_", "") || "30")
        const dueDate = new Date(now.getTime() + paymentTermsDays * 24 * 60 * 60 * 1000)
        
        // In a real implementation, we'd create an invoice record
        // For now, just log the invoice details
        console.log(`[Invoice Generation] Generated ${invoiceNumber} for ${company.name}:`)
        console.log(`  - Orders: ${orders.length}`)
        console.log(`  - Total: $${totalAmount.toFixed(2)}`)
        console.log(`  - Due: ${dueDate.toISOString().split('T')[0]}`)
        
        generatedCount++
      } catch (error) {
        console.error(`[Invoice Generation] Failed for company ${company.name}:`, error)
      }
    }
    
    console.log(`[Invoice Generation] Generated ${generatedCount} invoices`)
  } catch (error) {
    console.error("[Invoice Generation] Job failed:", error)
  }
}

export const config = {
  name: "invoice-generation",
  schedule: "0 4 1 * *", // 1st of every month at 4 AM
}
