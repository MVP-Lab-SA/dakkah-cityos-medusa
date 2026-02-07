// @ts-nocheck
import { MedusaContainer } from "@medusajs/framework/types"

export default async function subscriptionRenewalReminderJob(container: MedusaContainer) {
  const query = container.resolve("query")
  const eventBus = container.resolve("event_bus")
  
  console.log("[Renewal Reminder] Checking for upcoming renewals...")
  
  try {
    const now = new Date()
    
    // Send reminders at 7 days and 3 days before renewal
    const reminderDays = [7, 3]
    let totalReminders = 0
    
    for (const days of reminderDays) {
      const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      const dayStart = new Date(targetDate)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(targetDate)
      dayEnd.setHours(23, 59, 59, 999)
      
      const { data: upcomingRenewals } = await query.graph({
        entity: "subscription",
        fields: ["*", "customer.*", "plan.*"],
        filters: {
          status: "active",
          next_billing_date: {
            $gte: dayStart.toISOString(),
            $lt: dayEnd.toISOString()
          }
        }
      })
      
      for (const subscription of upcomingRenewals || []) {
        // Check if we already sent this reminder
        const reminderKey = `renewal_reminder_${days}d_sent`
        const currentBillingDate = subscription.next_billing_date
        const lastReminderFor = subscription.metadata?.[`${reminderKey}_for`]
        
        if (lastReminderFor === currentBillingDate) {
          continue // Already sent for this billing cycle
        }
        
        await eventBus.emit("subscription.renewal_upcoming", {
          id: subscription.id,
          days_until_renewal: days
        })
        
        // Mark reminder as sent (would need subscription service update)
        // This prevents duplicate reminders
        
        totalReminders++
        console.log(`[Renewal Reminder] ${days}-day reminder sent for subscription ${subscription.id}`)
      }
    }
    
    console.log(`[Renewal Reminder] Sent ${totalReminders} reminders`)
  } catch (error) {
    console.error("[Renewal Reminder] Job failed:", error)
  }
}

export const config = {
  name: "subscription-renewal-reminder",
  schedule: "0 10 * * *", // Daily at 10 AM
}
