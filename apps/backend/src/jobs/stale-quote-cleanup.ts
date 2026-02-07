import { MedusaContainer } from "@medusajs/framework/types"

export default async function staleQuoteCleanupJob(container: MedusaContainer) {
  const query = container.resolve("query")
  const quoteService = container.resolve("quote")
  
  console.log("[Quote Cleanup] Checking for stale quotes...")
  
  try {
    // Quotes expire after 30 days by default
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: staleQuotes } = await query.graph({
      entity: "quote",
      fields: ["id", "status", "created_at", "valid_until", "customer.*"],
      filters: {
        status: { $in: ["draft", "sent", "pending"] },
        created_at: { $lt: thirtyDaysAgo.toISOString() }
      }
    })
    
    if (!staleQuotes || staleQuotes.length === 0) {
      console.log("[Quote Cleanup] No stale quotes found")
      return
    }
    
    let expiredCount = 0
    
    for (const quote of staleQuotes) {
      // Check if quote has explicit valid_until that hasn't passed
      if (quote.valid_until && new Date(quote.valid_until) > new Date()) {
        continue
      }
      
      try {
        await quoteService.updateQuotes({
          id: quote.id,
          status: "expired",
          expired_at: new Date(),
          metadata: {
            auto_expired: true,
            expired_reason: "exceeded_30_day_limit"
          }
        })
        
        expiredCount++
      } catch (error) {
        console.error(`[Quote Cleanup] Failed to expire quote ${quote.id}:`, error)
      }
    }
    
    console.log(`[Quote Cleanup] Expired ${expiredCount} quotes`)
  } catch (error) {
    console.error("[Quote Cleanup] Job failed:", error)
  }
}

export const config = {
  name: "stale-quote-cleanup",
  schedule: "0 3 * * *", // Daily at 3 AM
}
