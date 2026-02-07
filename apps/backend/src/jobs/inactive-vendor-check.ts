// @ts-nocheck
import { MedusaContainer } from "@medusajs/framework/types"

export default async function inactiveVendorCheckJob(container: MedusaContainer) {
  const query = container.resolve("query")
  const vendorService = container.resolve("vendor")
  const eventBus = container.resolve("event_bus")
  
  console.log("[Inactive Vendor Check] Checking for inactive vendors...")
  
  try {
    // Vendors with no orders in 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    // Get all active vendors
    const { data: activeVendors } = await query.graph({
      entity: "vendor",
      fields: ["id", "name", "contact_email", "status", "last_order_at", "metadata"],
      filters: {
        status: "active"
      }
    })
    
    if (!activeVendors || activeVendors.length === 0) {
      console.log("[Inactive Vendor Check] No active vendors found")
      return
    }
    
    let warningCount = 0
    let deactivatedCount = 0
    
    for (const vendor of activeVendors) {
      const lastOrderAt = vendor.last_order_at ? new Date(vendor.last_order_at) : null
      const warningsSent = vendor.metadata?.inactivity_warnings || 0
      
      // Skip if recent order
      if (lastOrderAt && lastOrderAt > ninetyDaysAgo) {
        continue
      }
      
      // Check if never had an order and is older than 90 days
      const vendorAge = vendor.metadata?.created_at 
        ? Date.now() - new Date(vendor.metadata.created_at).getTime()
        : Infinity
      
      if (!lastOrderAt && vendorAge < 90 * 24 * 60 * 60 * 1000) {
        // New vendor, not inactive yet
        continue
      }
      
      if (warningsSent >= 2) {
        // Deactivate after 2 warnings
        await vendorService.updateVendors({
          id: vendor.id,
          status: "inactive",
          metadata: {
            ...vendor.metadata,
            deactivated_at: new Date().toISOString(),
            deactivation_reason: "prolonged_inactivity"
          }
        })
        
        await eventBus.emit("vendor.deactivated", {
          id: vendor.id,
          reason: "prolonged_inactivity"
        })
        
        deactivatedCount++
        console.log(`[Inactive Vendor Check] Deactivated vendor: ${vendor.name}`)
      } else {
        // Send warning
        await vendorService.updateVendors({
          id: vendor.id,
          metadata: {
            ...vendor.metadata,
            inactivity_warnings: warningsSent + 1,
            last_inactivity_warning: new Date().toISOString()
          }
        })
        
        await eventBus.emit("vendor.inactivity_warning", {
          id: vendor.id,
          warning_number: warningsSent + 1
        })
        
        warningCount++
        console.log(`[Inactive Vendor Check] Warning ${warningsSent + 1} sent to: ${vendor.name}`)
      }
    }
    
    console.log(`[Inactive Vendor Check] Completed - Warnings: ${warningCount}, Deactivated: ${deactivatedCount}`)
  } catch (error) {
    console.error("[Inactive Vendor Check] Job failed:", error)
  }
}

export const config = {
  name: "inactive-vendor-check",
  schedule: "0 6 * * 1", // Weekly on Monday at 6 AM
}
