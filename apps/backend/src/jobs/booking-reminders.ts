import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Scheduled job to send booking reminders
 * Runs every hour to check for bookings happening in the next 24 hours
 */
export default async function bookingRemindersJob(container: MedusaContainer) {
  const bookingService = container.resolve("booking")
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve("logger")

  logger.info("[booking-reminders] Starting booking reminders job")

  try {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Get bookings in the next 24 hours that haven't had reminders sent
    const bookings = await bookingService.listBookings({
      status: "confirmed",
      start_time: {
        $gte: now.toISOString(),
        $lte: tomorrow.toISOString(),
      },
      reminder_sent: false,
    })

    logger.info(`[booking-reminders] Found ${bookings.length} bookings needing reminders`)

    let sentCount = 0

    for (const booking of bookings) {
      if (!booking.customer_email) {
        logger.warn(`[booking-reminders] No email for booking ${booking.id}`)
        continue
      }

      try {
        // Send reminder email
        await notificationService.createNotifications({
          to: booking.customer_email,
          channel: "email",
          template: "booking-reminder",
          data: {
            booking_id: booking.id,
            service_name: booking.service?.name || "Your appointment",
            provider_name: booking.provider?.name,
            start_time: booking.start_time,
            location: booking.location,
            customer_name: booking.customer_name,
          },
        })

        // Mark reminder as sent
        await bookingService.updateBookings(
          { id: booking.id },
          { reminder_sent: true }
        )

        sentCount++
        logger.info(`[booking-reminders] Sent reminder for booking ${booking.id}`)
      } catch (error: any) {
        logger.error(`[booking-reminders] Failed to send reminder for ${booking.id}:`, error)
      }
    }

    logger.info(`[booking-reminders] Sent ${sentCount} reminders`)
  } catch (error) {
    logger.error("[booking-reminders] Job failed:", error)
  }
}

export const config = {
  name: "booking-reminders",
  schedule: "0 * * * *", // Every hour
}
