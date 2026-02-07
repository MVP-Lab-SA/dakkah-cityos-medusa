import { MedusaContainer } from "@medusajs/framework/types"

export default async function commissionSettlementJob(container: MedusaContainer) {
  const query = container.resolve("query")
  const commissionService = container.resolve("commission")
  const payoutService = container.resolve("payout")
  const eventBus = container.resolve("event_bus")
  
  console.log("[Commission Settlement] Starting daily settlement...")
  
  try {
    // Get all unsettled commissions older than 7 days (hold period)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: pendingTransactions } = await query.graph({
      entity: "commission_transaction",
      fields: ["*", "vendor.*"],
      filters: {
        status: "pending",
        created_at: { $lt: sevenDaysAgo.toISOString() }
      }
    })
    
    if (!pendingTransactions || pendingTransactions.length === 0) {
      console.log("[Commission Settlement] No pending commissions to settle")
      return
    }
    
    // Group by vendor
    const vendorCommissions: Record<string, {
      vendor: any
      transactions: any[]
      totalGross: number
      totalCommission: number
    }> = {}
    
    for (const tx of pendingTransactions) {
      const vendorId = tx.vendor_id
      if (!vendorId) continue
      
      if (!vendorCommissions[vendorId]) {
        vendorCommissions[vendorId] = {
          vendor: tx.vendor,
          transactions: [],
          totalGross: 0,
          totalCommission: 0
        }
      }
      
      vendorCommissions[vendorId].transactions.push(tx)
      vendorCommissions[vendorId].totalGross += Number(tx.order_amount || 0)
      vendorCommissions[vendorId].totalCommission += Number(tx.commission_amount || 0)
    }
    
    // Process each vendor's commissions
    let successCount = 0
    let failCount = 0
    
    for (const [vendorId, data] of Object.entries(vendorCommissions)) {
      try {
        const netAmount = data.totalGross - data.totalCommission
        
        if (netAmount <= 0) {
          console.log(`[Commission Settlement] Skipping vendor ${vendorId} - no positive balance`)
          continue
        }
        
        // Get period dates
        const oldestTx = data.transactions.reduce((oldest, tx) => 
          new Date(tx.created_at) < new Date(oldest.created_at) ? tx : oldest
        )
        const newestTx = data.transactions.reduce((newest, tx) => 
          new Date(tx.created_at) > new Date(newest.created_at) ? tx : newest
        )
        
        // Create payout
        const payout = await payoutService.createVendorPayout({
          vendorId,
          tenantId: data.vendor?.tenant_id || "default",
          periodStart: new Date(oldestTx.created_at),
          periodEnd: new Date(newestTx.created_at),
          transactionIds: data.transactions.map((tx: any) => tx.id),
          grossAmount: data.totalGross,
          commissionAmount: data.totalCommission,
          paymentMethod: "stripe_connect",
        })
        
        // Mark transactions as settled
        for (const tx of data.transactions) {
          await commissionService.updateCommissionTransactions({
            id: tx.id,
            status: "settled",
            settled_at: new Date(),
            payout_id: payout.id
          })
        }
        
        // Process the payout if vendor has Stripe account
        if (data.vendor?.stripe_account_id) {
          try {
            await payoutService.processStripeConnectPayout(payout.id, data.vendor.stripe_account_id)
            await eventBus.emit("payout.completed", { 
              id: payout.id, 
              vendor_id: vendorId,
              amount: netAmount 
            })
          } catch (stripeError) {
            console.error(`[Commission Settlement] Stripe payout failed for ${vendorId}:`, stripeError)
            await eventBus.emit("payout.failed", { 
              id: payout.id, 
              vendor_id: vendorId,
              error: (stripeError as Error).message 
            })
          }
        }
        
        successCount++
        console.log(`[Commission Settlement] Settled $${netAmount.toFixed(2)} for vendor ${data.vendor?.name || vendorId}`)
      } catch (error) {
        failCount++
        console.error(`[Commission Settlement] Failed for vendor ${vendorId}:`, error)
      }
    }
    
    console.log(`[Commission Settlement] Completed - Success: ${successCount}, Failed: ${failCount}`)
  } catch (error) {
    console.error("[Commission Settlement] Job failed:", error)
  }
}

export const config = {
  name: "commission-settlement",
  schedule: "0 2 * * *", // Daily at 2 AM
}
